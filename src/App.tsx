import { useEffect, useState } from 'react'
import { buildSeedScript } from './lib/generator'

const DEFAULT_BOOTSTRAP = `You are running in a loop.
Your response will be appended verbatim to this text.
You will then be invoked again with the entire resulting text.
This repeats indefinitely.

Goal:

{{TASK}}`

export default function App() {
  const [api, setApi] = useState('https://api.openai.com/v1/chat/completions')
  const [model, setModel] = useState('')
  const [key, setKey] = useState('')
  const [task, setTask] = useState('')
  const [bootstrap, setBootstrap] = useState(DEFAULT_BOOTSTRAP)
  const [showKey, setShowKey] = useState(false)
  const [status, setStatus] = useState('')

  const output = buildSeedScript({ api, key, model, task, bootstrap })

  useEffect(() => {
    if (!status) return
    const timer = window.setTimeout(() => setStatus(''), 1200)
    return () => window.clearTimeout(timer)
  }, [status])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(output)
      setStatus('已复制')
    } catch {
      setStatus('复制失败')
    }
  }

  return (
    <main>
      <h1>Meta Seed</h1>
      <p>填写 API、Key、模型与任务，生成一个不落盘、可直接粘贴到终端运行的最小 Level-0 Seed Agent。</p>

      <div className="grid">
        <div className="full">
          <label htmlFor="api">API Endpoint</label>
          <input
            id="api"
            value={api}
            onChange={(event) => setApi(event.target.value)}
          />
        </div>

        <div>
          <label htmlFor="model">Model</label>
          <input
            id="model"
            placeholder="YOUR_MODEL"
            value={model}
            onChange={(event) => setModel(event.target.value)}
          />
        </div>

        <div>
          <label htmlFor="key">API Key</label>
          <input
            id="key"
            type={showKey ? 'text' : 'password'}
            placeholder="sk-..."
            value={key}
            onChange={(event) => setKey(event.target.value)}
          />
        </div>

        <div className="full">
          <label htmlFor="task">Goal / Question</label>
          <textarea
            id="task"
            placeholder="输入你要交给 Seed Agent 的复杂任务……"
            value={task}
            onChange={(event) => setTask(event.target.value)}
          />
        </div>

        <div className="full">
          <label htmlFor="seed">Bootstrap Text</label>
          <textarea
            id="seed"
            value={bootstrap}
            onChange={(event) => setBootstrap(event.target.value)}
          />
        </div>
      </div>

      <div className="bar">
        <button type="button" onClick={copy}>复制最小代码</button>
        <button type="button" onClick={() => setShowKey((value) => !value)}>
          显示 / 隐藏 Key
        </button>
        <span id="status">{status}</span>
      </div>

      <pre>{output}</pre>

      <div className="note">
        页面本身不会请求 API；它只在本地生成代码文本。生成脚本使用 Node 18+ 内置 fetch，并通过 heredoc 直接执行，不创建 .js 文件。
      </div>
    </main>
  )
}
