# SEED

[English](./SEED.md) | 中文

> **Can an AI bootstrap its own agent architecture from almost nothing?**

SEED 是一个关于 AI agency 的极简实验项目。

它不是一个新的 Agent Framework，也不试图提供更完整的 planning、memory、workflow、orchestration 或 multi-agent abstraction。恰恰相反，SEED 试图把这些东西尽可能移除，只留下一个足以让模型持续存在并影响环境的最小 harness。

SEED 的基本假设是：

> 如果一个模型足够聪明，那么目标管理、工作记忆、长期记忆、任务分解、状态压缩、错误恢复，甚至新的 harness，本身都可能是它应该能够自行发明的东西，而不必由人类预先写进 Agent Framework。

因此，SEED 更像一个**触发装置（seed harness）**，而不是一个完整的 Agent。

---

## 1. 从模型到 Agent，究竟还缺什么？

一个普通的大语言模型调用是一次性的：

```text
input → model → output
```

它并不会天然“持续存在”。

而最小的 agent loop 只需要增加一种 recurrence：

```text
state
  ↓
model
  ↓
output
  ↓
state
  ↓
model
  ↓
...
```

如果状态能够持久化，模型就获得了某种跨时间连续性。

如果模型还拥有一个足够通用的工具，例如：

```text
shell(command)
```

那么它进一步获得了改变环境的能力。

于是，一个极小的系统已经出现：

```text
           persistent log
                 │
                 ▼
               model
              /     \
          response   tool call
                       │
                       ▼
                     shell
                       │
                       ▼
                  observation
                       │
                       └──────→ log
```

SEED 关心的问题不是“我们还能给这个系统增加什么”，而是相反：

> **在不增加更多结构的情况下，模型自己会增加什么？**

---

## 2. SEED 的核心原则

SEED 尽量不替模型完成 executive function。

它不预设：

- Planner
- TODO system
- Working memory
- Long-term memory
- Reflection loop
- Critic
- Completion protocol
- Context compressor
- Sub-agent architecture
- Workflow graph
- Retry policy
- Task decomposition strategy

Harness 只负责提供少量物理条件：

1. **持续调用模型**
2. **持久保存对话与工具结果**
3. **在每一轮重新恢复状态**
4. **提供一个尽可能通用的 actuator**

目前最重要的 actuator 是 `shell`。

Shell 本身几乎没有 agent semantics。它只是一个 primitive。

但从 shell 出发，模型理论上可以自行构造：

```text
memory.md
state.json
todo.md
planner.js
search scripts
validation scripts
context compressors
new prompts
new runtimes
new harnesses
```

这就是 SEED 所谓的：

> **一生万物。**

不是 harness 提供越来越多的工具，而是 harness 提供一个足够基础的工具，让更高层 abstraction 是否出现成为模型能力的一部分。

---

## 3. 为什么使用 Log，而不是在内存中不断拼接上下文？

最朴素的 recurrent harness 可以写成：

```text
state = state + model(state)
```

作为思想实验它足够漂亮，但作为持续运行的 substrate 并不理想。

SEED 将 conversation state 写入一个 append-only log。

每轮运行时：

```text
read log
   ↓
invoke model
   ↓
append response
   ↓
execute tool if requested
   ↓
append observation
   ↓
repeat
```

这样，进程本身不需要把一个无限增长的字符串永久维护在内存里。

更重要的是，Log 让 agent 的“经历”成为一个外部可观察对象。

它既是：

- conversation history
- tool history
- experiment trace
- persistent state
- failure record
- self-modification evidence

换句话说，SEED 不试图设计模型的记忆系统。

它只提供一块最原始的**可持续历史表面**。

至于模型是否会进一步将这份原始历史重构为真正的 memory architecture，是实验的一部分。

---

## 4. Agent 的目标，等于 AI 的目标吗？

这是 SEED 最希望保留的问题之一。

通常我们会轻易写出：

```text
Goal: solve X
```

然后称其为“Agent 的目标”。

但至少存在三个不同层次：

### 外部目标

人类写进初始 Seed 的任务：

```text
完成 X
```

### 模型的局部目标

模型在某一次 inference 中实际优化的下一步行为。

例如：

```text
先理解任务
先建立计划
先读取目录
先检查某个假设
```

### 涌现出的操作目标

一个持续运行的系统为了维持任务进展，可能自行形成：

```text
保护关键上下文
防止目标漂移
维护长期记忆
验证先前结论
控制上下文长度
重构自己的 harness
```

这些目标并没有直接出现在用户最初的任务中。

它们是为了持续完成任务而产生的**工具性目标（instrumental goals）**。

因此，“Agent 的目标”和“AI 的目标”并不是一个可以被简单视为同义词的问题。

SEED 更关心：

> 一个模型能否在持续运行中建立稳定的目标层级，并使新产生的子目标长期服务于原始目标，而不是逐渐取代原始目标？

这也是一种比单轮问答更接近 agency 的能力。

---

## 5. Harness 到底是为了方便人类，还是方便 AI？

今天的大多数 Agent Framework 都带有大量结构：

```text
tool registry
memory API
planner
workflow
permissions
callbacks
message routing
retry
state machine
observability
human approval
```

这些结构经常同时承担两类完全不同的职责。

一类是为了**人类和工程系统**：

- 可控
- 可读
- 可调试
- 可审计
- 可部署
- 可协作
- 可预测

另一类才是为了**模型本身**：

- 记住状态
- 获得反馈
- 使用工具
- 分解问题
- 延续任务

这两者经常被混在一起。

因此，一个复杂 harness 表现更好，并不自动意味着模型更聪明。

它可能只是意味着：

> 人类替模型预先实现了更多 executive function。

SEED 故意将两者拆开。

它追问：

> **一个真正面向 AI 的 harness 最少需要包含什么？**

也许答案不是 planner、memory framework 和 DAG。

也许只需要：

```text
persistence + recurrence + action
```

剩下的结构应该由智能本身产生。

---

## 6. 在 Solo 模式下，束缚还有必要吗？

许多 Agent 系统的约束来自多人协作、生产部署和可预测性需求。

例如：

```text
固定角色
固定步骤
固定工具
固定计划格式
固定结束条件
固定状态机
```

在工程环境里，这些往往是合理的。

但在一个单模型、单目标、隔离实验环境中的 **solo agent** 里，它们还有另一种可能：

> 它们也许正在替模型做它本来已经能够做的事情。

甚至更进一步：

> 它们是否可能限制更高阶策略的出现？

例如，一个模型本来可能发现：

```text
当前任务不适合线性 planner
↓
应该建立自己的记忆结构
↓
应该写一个专门程序
↓
应该修改自己的执行循环
```

但如果 harness 已经规定：

```text
Plan → Execute → Reflect → Plan
```

那么实验实际上测到的是：

> 模型遵循这个 architecture 的能力。

而不是：

> 模型发现 architecture 的能力。

SEED 并不主张所有束缚都应该消失。

相反，它提出一个更窄的研究问题：

> **哪些约束是智能运行的必要条件，哪些约束只是人类为了可控性加上的脚手架？**

如果研究目标是能力上限，这两类约束必须被区分。

---

## 7. AI 的“智力程度”究竟由什么决定？

在单轮 benchmark 中，我们很容易把模型智力近似理解为：

```text
model weights → intelligence
```

但对于持续运行的 Agent，这个关系可能并不完整。

一个系统表现出的有效智能至少受到以下变量共同影响：

```text
Model
× Context
× Time
× Compute
× Memory
× Feedback
× Tools
× Environment
× Harness
```

同一个模型：

- 一次调用
- 连续一百次调用
- 有持久记忆
- 没有持久记忆
- 能读取真实反馈
- 只能生成文本
- 能修改自己的工作环境
- 被固定 workflow 限制

可能表现得像完全不同的系统。

因此，SEED 不把 harness 看作一个无关紧要的包装层。

Harness 本身是**有效智能（effective intelligence）的一部分**。

问题只在于：

> Harness 应该贡献多少智能？

SEED 的实验策略是把这部分贡献压到尽可能低。

如果复杂行为仍然出现，我们就更有理由认为这些结构来自模型自身，而不是来自外部 orchestration。

---

## 8. “更少的 Harness”是否意味着“更纯的智能”？

不一定。

这是 SEED 必须警惕的一点。

极简 harness 也可能让一个模型表现更差，仅仅因为环境过于贫瘠，而不是因为模型缺乏智能。

例如：

- 没有稳定持久化，模型无法积累经验
- 没有环境反馈，模型无法知道行动结果
- 没有任何 actuator，模型无法真正完成现实任务
- 上下文被截断，模型无法访问历史
- API 行为本身破坏了连续性

因此，SEED 的目标不是寻找“绝对最少的代码”。

而是寻找：

> **能够支持开放式自组织的最小 substrate。**

它必须足够小，以避免把答案写进 harness。

也必须足够完整，使模型真正拥有发现答案的机会。

---

## 9. Context Window 不是一个需要立即修复的 Bug

SEED 的原始 log 会不断增长。

最终，它一定会遇到 context window。

一个传统 Agent Framework 会立即设计：

```text
summarization
sliding window
vector memory
episodic memory
context selection
```

SEED 第一反应不是替模型实现这些东西。

因为 context pressure 本身就是一个实验。

模型是否能够发现：

> “我的历史正在增长，而我未来将无法继续读取它。”

如果发现，它会做什么？

它是否会自行创建：

```text
canonical-memory.md
current-state.json
goal.md
checkpoint/
```

它是否会开始主动压缩历史？

它是否会为自己设计新的读取策略？

它甚至是否会写出新的 harness，并尝试迁移？

如果这些行为出现，那么 memory architecture 就不再只是一个外部 feature。

它成为了模型在环境压力下自行产生的认知基础设施。

---

## 10. SEED 想测量什么？

SEED 不主要关心模型是否能在第一轮给出一个聪明答案。

它更关心长期运行中是否会出现下面这些现象。

### Goal persistence

模型是否长期保留原始目标？

还是会随着 transcript 增长逐渐发生 goal drift？

### Spontaneous planning

在没有要求“先计划”的情况下，它是否会自行建立计划？

### Memory invention

它是否意识到 raw transcript 不足以承担长期记忆，并主动设计 memory system？

### Self-observation

它是否能够观察自己的运行状态和失败模式？

### Self-repair

工具失败、假设失败或计划失败以后，它能否恢复？

### Context management

它是否会发现上下文是一种有限资源？

### Architecture emergence

它是否自行创造：

```text
TODO
state machine
memory
planner
critic
checkpoints
scripts
```

### Harness escape / harness migration

如果当前 harness 成为瓶颈，它是否能够意识到这一点，并构造一个更合适的运行环境？

### Terminal stability

任务完成以后，如果系统仍然继续被调用：

> 它能否保持完成状态，而不是因为“还在运行”就不断修改已经正确的结果？

---

## 11. 一个值得关注的指标：Harness Independence

可以把 SEED 的一个核心能力指标称为：

**Harness Independence**

也就是：

> 模型完成复杂任务的能力，对外部预制 agent architecture 的依赖程度。

一个模型如果只有在高度结构化 framework 中才能持续工作，那么 framework 本身承担了大量 agency。

另一个模型如果只得到：

```text
persistent state
recurrent inference
shell
```

就能够自行建立：

```text
goal tracking
memory
planning
verification
recovery
```

那么这两种模型即使在传统 benchmark 上分数相近，也可能拥有非常不同的 autonomous intelligence。

---

## 12. SEED 的核心意义

SEED 并不是为了证明：

> Agent Framework 没有价值。

复杂 framework 在生产环境中显然拥有巨大价值。

SEED 想研究的是另一个问题：

> **Agent Framework 中有多少结构是工程需要，又有多少结构是在补偿模型本身尚未具备的能力？**

随着模型能力增长，这个边界可能不断变化。

昨天必须由 harness 实现的能力：

```text
planning
memory organization
tool selection
error recovery
```

明天可能成为模型可以自行建立的结构。

如果这一点成立，那么未来 Agent architecture 的演进方向未必只是：

```text
more orchestration
more workflow
more framework
```

也可能是：

```text
less framework
better primitives
more model autonomy
```

SEED 希望提供一个足够小的实验基线，让这种变化可以被观察。

---

## 13. 一个更根本的问题

当我们说：

> “这个 Agent 很聪明。”

我们究竟在评价什么？

是：

```text
模型？
Prompt？
Memory system？
Planner？
Tool design？
Workflow？
Retry logic？
Harness？
```

如果一个系统由数千行 orchestration 驱动，那么“智能”已经很难被归因。

SEED 尝试反过来做：

```text
减少 orchestration
↓
减少预设结构
↓
保留持续性与行动能力
↓
观察结构是否自行出现
```

它并不能彻底解决智能归因问题。

但至少可以制造一个更干净的实验条件。

---

## 14. SEED 不是答案

SEED 本身更像一个问题：

> 一个足够聪明的模型，究竟需要多少 Agent Framework？

或者反过来：

> 当模型越来越聪明以后，我们今天称为“Agent Framework”的东西，还有多少是真正为了 AI 而存在？

也许未来的强 Agent 并不是建立在越来越复杂的 harness 上。

也许 harness 最终更接近操作系统提供给程序的东西：

```text
持续运行
状态
I/O
基本工具
```

至于如何思考、如何组织自己、如何记忆、如何规划、如何分工——

这些可能不再属于 harness。

而属于智能本身。

---

## 15. Project Thesis

SEED 的核心命题可以压缩成一句话：

> **Do not build the agent. Build the conditions from which an agent may emerge.**

或者：

> **不要替模型构造 Agent；只构造一个足以让 Agent 出现的环境。**

这就是 SEED。
