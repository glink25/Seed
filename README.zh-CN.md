# SEED

[English](./README.md) | 中文

> 一生万物。One becomes all.

从最小循环中，让 Agent 自行出现。

[SEED 理念](./docs/SEED.zh-CN.md)

## 快速开始使用SEED Agent

1. 打开[SEED](https://seed.linkai.work/)
2. 填入api
3. 复制代码并粘贴到终端中运行，开始使用

生成器完全在浏览器本地运行，可生成粘贴到 Node.js 18+ 或 Python 3 终端执行的代码，不会从网页发出 API 请求。

生成器配置（包括 API Key）会以明文保存在浏览器本地存储中，任务文本永远不会保存。清空字段或浏览器中的站点数据即可删除已保存配置。

生成的 Agent 会将完整对话持久化为 JSONL 日志，并向模型提供原生 `shell(command)` 工具。请确保仅在允许模型执行 Shell 命令的目录和隔离环境中运行；删除配置的日志文件即可开始全新运行。
