const q = (s: string): string => JSON.stringify(s)

export const codeLanguages = ['nodejs', 'python'] as const

export type CodeLanguage = (typeof codeLanguages)[number]

export interface SeedForm {
  api: string
  key: string
  model: string
  log: string
  task: string
  bootstrap: string
  language: CodeLanguage
}

export function isCodeLanguage(value: unknown): value is CodeLanguage {
  return typeof value === 'string' && codeLanguages.includes(value as CodeLanguage)
}

export function buildSeedScript({
  api,
  key,
  model,
  log,
  task,
  bootstrap,
  language,
}: SeedForm): string {
  const endpoint = api.trim() || 'YOUR_API'
  const apiKey = key || 'YOUR_API_KEY'
  const modelName = model.trim() || 'YOUR_MODEL'
  const logPath = log.trim() || '.seed-agent.jsonl'
  const seed = bootstrap.replace('{{TASK}}', task)

  if (language === 'python') {
    return buildPythonScript(endpoint, apiKey, modelName, logPath, seed)
  }

  return buildNodeScript(endpoint, apiKey, modelName, logPath, seed)
}

function buildNodeScript(
  endpoint: string,
  apiKey: string,
  modelName: string,
  logPath: string,
  seed: string,
): string {
  return `node --input-type=module <<'NODE'
import fs from "node:fs";
import {spawnSync} from "node:child_process";

const API=${q(endpoint)};
const KEY=${q(apiKey)};
const MODEL=${q(modelName)};
const LOG=${q(logPath)};
const SEED=${q(seed)};

const tools=[{
  type:"function",
  function:{
    name:"shell",
    description:"Execute a shell command in the current working directory and return stdout, stderr, and exit status.",
    parameters:{
      type:"object",
      properties:{command:{type:"string",description:"Shell command to execute."}},
      required:["command"],
      additionalProperties:false
    }
  }
}];

const add=m=>fs.appendFileSync(LOG,JSON.stringify(m)+"\\n");
const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));

if(!fs.existsSync(LOG))
  add({role:"user",content:SEED});

while(true){
  const messages=fs.readFileSync(LOG,"utf8")
    .split("\\n").filter(Boolean).map(JSON.parse);

  let response;
  try{
    response=await fetch(API,{
      method:"POST",
      headers:{
        Authorization:\`Bearer \${KEY}\`,
        "Content-Type":"application/json"
      },
      body:JSON.stringify({model:MODEL,messages,tools,tool_choice:"auto"})
    });
  }catch(error){
    console.error("[network]",error instanceof Error?error.message:String(error));
    await wait(2000);
    continue;
  }

  if(!response.ok){
    console.error("[api]",response.status,await response.text());
    await wait(2000);
    continue;
  }

  const result=await response.json();
  const message=result.choices?.[0]?.message;
  if(!message){
    console.error("[api] invalid response",JSON.stringify(result));
    await wait(2000);
    continue;
  }

  const assistant={role:"assistant",content:message.content??null};
  if(message.tool_calls) assistant.tool_calls=message.tool_calls;
  add(assistant);

  if(message.content) console.log("\\n"+message.content+"\\n");

  for(const call of message.tool_calls||[]){
    let output;
    try{
      const {command}=JSON.parse(call.function.arguments);
      console.log("\\n$ "+command);
      const process=spawnSync(command,{
        shell:true,
        encoding:"utf8",
        maxBuffer:64*1024*1024
      });
      output=(process.stdout||"")+(process.stderr||"")+
        \`\\n[exit \${process.status===null?"null":process.status}\${process.signal?", signal "+process.signal:""}]\`;
    }catch(error){
      output="[tool error] "+(error instanceof Error?error.message:String(error));
    }
    console.log(output);
    add({role:"tool",tool_call_id:call.id,content:output});
  }
}
NODE`
}

function buildPythonScript(
  endpoint: string,
  apiKey: string,
  modelName: string,
  logPath: string,
  seed: string,
): string {
  return `python3 <<'PYTHON'
import json
import os
import subprocess
import time
import urllib.error
import urllib.request

API = ${q(endpoint)}
KEY = ${q(apiKey)}
MODEL = ${q(modelName)}
LOG = ${q(logPath)}
SEED = ${q(seed)}

TOOLS = [{
    "type": "function",
    "function": {
        "name": "shell",
        "description": "Execute a shell command in the current working directory and return stdout, stderr, and exit status.",
        "parameters": {
            "type": "object",
            "properties": {
                "command": {"type": "string", "description": "Shell command to execute."}
            },
            "required": ["command"],
            "additionalProperties": False,
        },
    },
}]

def add(message):
    with open(LOG, "a", encoding="utf-8") as file:
        file.write(json.dumps(message, ensure_ascii=False) + "\\n")

if not os.path.exists(LOG):
    add({"role": "user", "content": SEED})

while True:
    with open(LOG, encoding="utf-8") as file:
        messages = [json.loads(line) for line in file if line.strip()]

    body = json.dumps({
        "model": MODEL,
        "messages": messages,
        "tools": TOOLS,
        "tool_choice": "auto",
    }).encode("utf-8")
    request = urllib.request.Request(
        API,
        data=body,
        headers={
            "Authorization": f"Bearer {KEY}",
            "Content-Type": "application/json",
        },
        method="POST",
    )

    try:
        with urllib.request.urlopen(request) as response:
            result = json.load(response)
    except urllib.error.HTTPError as error:
        detail = error.read().decode("utf-8", errors="replace")
        print("[api]", error.code, detail)
        time.sleep(2)
        continue
    except (urllib.error.URLError, OSError) as error:
        print("[network]", str(error))
        time.sleep(2)
        continue

    try:
        message = result["choices"][0]["message"]
    except (KeyError, IndexError, TypeError):
        print("[api] invalid response", json.dumps(result, ensure_ascii=False))
        time.sleep(2)
        continue

    assistant = {"role": "assistant", "content": message.get("content")}
    if message.get("tool_calls") is not None:
        assistant["tool_calls"] = message["tool_calls"]
    add(assistant)

    if message.get("content"):
        print(f"\\n{message['content']}\\n")

    for call in message.get("tool_calls") or []:
        try:
            command = json.loads(call["function"]["arguments"])["command"]
            print(f"\\n$ {command}")
            process = subprocess.run(
                command,
                shell=True,
                capture_output=True,
                text=True,
                encoding="utf-8",
                errors="replace",
            )
            output = process.stdout + process.stderr + f"\\n[exit {process.returncode}]"
        except Exception as error:
            output = "[tool error] " + str(error)
        print(output)
        add({"role": "tool", "tool_call_id": call["id"], "content": output})
PYTHON`
}
