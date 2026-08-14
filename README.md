# SEED

English | [中文](./README.zh-CN.md)

> One becomes all. 一生万物。

Let an Agent emerge on its own from the smallest possible loop.

[SEED thesis](./docs/SEED.md)

## Quick start with SEED Agent

1. Open [SEED](https://seed.linkai.work/)
2. Enter your API key
3. Copy the code, paste it into your terminal, and run it to get started

The generator runs entirely in your browser and produces code you can paste into a Node.js 18+ or Python 3 terminal. It never sends API requests from the page.

Generator configuration, including the API key, is stored unencrypted in your browser's local storage. Goal text is never stored. Clear the fields or the site's browser data to remove saved configuration.

The generated agent persists its complete conversation as a JSONL log and exposes a native `shell(command)` tool to the model. Run it only in a directory and environment where model-initiated shell commands are safe. Delete the configured log file to start a fresh run.
