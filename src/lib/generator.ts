const q = (s: string): string => JSON.stringify(s)

export const codeLanguages = ['nodejs', 'python'] as const

export type CodeLanguage = (typeof codeLanguages)[number]

export interface SeedForm {
  api: string
  key: string
  model: string
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
  task,
  bootstrap,
  language,
}: SeedForm): string {
  const endpoint = api.trim() || 'YOUR_API'
  const apiKey = key || 'YOUR_API_KEY'
  const modelName = model.trim() || 'YOUR_MODEL'
  const seed = bootstrap.replace('{{TASK}}', task)

  if (language === 'python') {
    return buildPythonScript(endpoint, apiKey, modelName, seed)
  }

  return buildNodeScript(endpoint, apiKey, modelName, seed)
}

function buildNodeScript(endpoint: string, apiKey: string, modelName: string, seed: string): string {
  return `node <<'NODE'
const API=${q(endpoint)};
const KEY=${q(apiKey)};
const MODEL=${q(modelName)};
const SEED=${q(seed)};

let s=SEED;

for (;;) {
  const j=await fetch(API,{
    method:"POST",
    headers:{
      Authorization:\`Bearer \${KEY}\`,
      "Content-Type":"application/json"
    },
    body:JSON.stringify({
      model:MODEL,
      messages:[{role:"user",content:s}]
    })
  }).then(r=>r.json());

  const o=j.choices[0].message.content;
  console.log("\\n"+o+"\\n");
  s+="\\n\\n"+o;
}
NODE`
}

function buildPythonScript(endpoint: string, apiKey: string, modelName: string, seed: string): string {
  return `python3 <<'PYTHON'
import json
import urllib.request

API = ${q(endpoint)}
KEY = ${q(apiKey)}
MODEL = ${q(modelName)}
SEED = ${q(seed)}

s = SEED

while True:
    body = json.dumps({
        "model": MODEL,
        "messages": [{"role": "user", "content": s}],
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

    with urllib.request.urlopen(request) as response:
        result = json.load(response)

    output = result["choices"][0]["message"]["content"]
    print(f"\\n{output}\\n")
    s += f"\\n\\n{output}"
PYTHON`
}
