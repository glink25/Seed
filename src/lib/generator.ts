const q = (s: string): string => JSON.stringify(s)

export interface SeedForm {
  api: string
  key: string
  model: string
  task: string
  bootstrap: string
}

export function buildSeedScript({
  api,
  key,
  model,
  task,
  bootstrap,
}: SeedForm): string {
  const endpoint = api.trim() || 'YOUR_API'
  const apiKey = key || 'YOUR_API_KEY'
  const modelName = model.trim() || 'YOUR_MODEL'
  const seed = bootstrap.replace('{{TASK}}', task)

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
