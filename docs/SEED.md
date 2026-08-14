# SEED

English | [中文](./SEED.zh-CN.md)

> **Can an AI bootstrap its own agent architecture from almost nothing?**

SEED is a minimalist experiment in AI agency.

It is not a new agent framework, nor does it attempt to provide more complete abstractions for planning, memory, workflows, orchestration, or multi-agent systems. Quite the opposite: SEED tries to remove as much of that machinery as possible, leaving only a minimal harness that allows a model to persist over time and affect its environment.

SEED begins with a simple hypothesis:

> If a model is intelligent enough, then goal management, working memory, long-term memory, task decomposition, state compression, error recovery, and even a new harness may all be things it can invent for itself—rather than things humans must build into an agent framework in advance.

SEED is therefore closer to a **trigger—a seed harness**—than to a complete agent.

---

## 1. What Is Still Missing Between a Model and an Agent?

An ordinary large language model call is a one-shot process:

```text
input → model → output
```

It does not naturally persist.

A minimal agent loop needs only one additional property: recurrence.

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

If state can persist, the model gains a form of continuity across time.

If the model also has a sufficiently general tool, such as:

```text
shell(command)
```

then it gains the ability to change its environment.

A tiny system has now emerged:

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

SEED does not ask, “What else can we add to this system?” It asks the opposite:

> **Without adding more structure, what will the model add by itself?**

---

## 2. SEED's Core Principles

SEED avoids performing executive functions on the model's behalf.

It does not prescribe a:

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

The harness provides only a few physical conditions:

1. **Call the model repeatedly**
2. **Persist conversations and tool results**
3. **Restore state on every iteration**
4. **Provide an actuator that is as general as possible**

The most important actuator today is the `shell`.

The shell itself has almost no agent semantics. It is merely a primitive.

Starting from a shell, however, a model could theoretically construct:

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

This is what SEED means by:

> **One becomes all.**

The harness does not provide an ever-growing collection of tools. It provides a sufficiently fundamental tool so that the emergence of higher-level abstractions becomes part of what the model itself is capable of.

---

## 3. Why Use a Log Instead of Continually Concatenating Context in Memory?

The simplest recurrent harness could be written as:

```text
state = state + model(state)
```

It is elegant enough as a thought experiment, but not ideal as a substrate for continuous operation.

SEED writes conversation state to an append-only log.

On every iteration, it:

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

This means the process itself does not need to hold an infinitely growing string in memory forever.

More importantly, the log turns the agent's “experience” into an externally observable object.

It serves simultaneously as:

- conversation history
- tool history
- experiment trace
- persistent state
- failure record
- self-modification evidence

In other words, SEED does not try to design the model's memory system.

It provides only the most primitive **durable surface for history**.

Whether the model then restructures that raw history into a true memory architecture is part of the experiment.

---

## 4. Is an Agent's Goal the Same as an AI's Goal?

This is one of the questions SEED most wants to preserve.

We often write something like:

```text
Goal: solve X
```

and call it “the agent's goal.”

But there are at least three distinct layers.

### External goal

The task a human writes into the initial seed:

```text
Complete X
```

### The model's local goal

The next action the model actually optimizes for during a particular inference.

For example:

```text
First understand the task
First make a plan
First inspect the directory
First test an assumption
```

### Emergent operational goals

To sustain progress, a continuously running system may independently develop goals such as:

```text
protect critical context
prevent goal drift
maintain long-term memory
verify earlier conclusions
control context length
rebuild its own harness
```

These goals did not appear directly in the user's original task.

They are **instrumental goals** that arise in service of completing the task over time.

The “agent's goal” and the “AI's goal” therefore cannot simply be treated as synonyms.

SEED is more interested in this question:

> Can a model establish a stable hierarchy of goals during continuous operation, so that newly created subgoals continue to serve the original goal instead of gradually replacing it?

That ability is closer to agency than one-shot question answering is.

---

## 5. Is the Harness for Humans or for AI?

Most agent frameworks today contain a great deal of structure:

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

These structures often serve two very different purposes at once.

One set exists for **humans and engineering systems**:

- Control
- Readability
- Debuggability
- Auditability
- Deployability
- Collaboration
- Predictability

The other exists for **the model itself**:

- Remembering state
- Receiving feedback
- Using tools
- Decomposing problems
- Continuing a task

The two are often conflated.

A complex harness performing better does not automatically mean that the model is more intelligent.

It may simply mean:

> Humans preimplemented more executive function for the model.

SEED deliberately separates the two.

It asks:

> **What is the minimum that a harness built truly for AI must contain?**

Perhaps the answer is not a planner, a memory framework, and a DAG.

Perhaps it is only:

```text
persistence + recurrence + action
```

The remaining structure should be produced by intelligence itself.

---

## 6. Are Constraints Still Necessary in Solo Mode?

Many constraints in agent systems come from the needs of team collaboration, production deployment, and predictability.

For example:

```text
fixed roles
fixed steps
fixed tools
fixed plan format
fixed termination condition
fixed state machine
```

These constraints are often reasonable in engineering environments.

But for a **solo agent** in an isolated experiment with one model and one goal, there is another possibility:

> They may be doing work on the model's behalf that the model could already do itself.

Going further:

> Could they constrain the emergence of higher-order strategies?

For example, a model might otherwise discover:

```text
this task is not suited to a linear planner
↓
I should build my own memory structure
↓
I should write a specialized program
↓
I should modify my execution loop
```

But if the harness has already prescribed:

```text
Plan → Execute → Reflect → Plan
```

then the experiment is actually measuring:

> The model's ability to follow that architecture.

Not:

> The model's ability to discover an architecture.

SEED does not argue that every constraint should disappear.

Instead, it poses a narrower research question:

> **Which constraints are necessary conditions for intelligence to operate, and which are merely scaffolding humans add for control?**

If the objective is to study the upper bound of capability, the two must be distinguished.

---

## 7. What Determines the “Level of Intelligence” of an AI?

In a one-shot benchmark, it is easy to approximate model intelligence as:

```text
model weights → intelligence
```

For a continuously running agent, however, that relationship may be incomplete.

The effective intelligence expressed by a system is influenced by at least these variables:

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

The same model may appear to be an entirely different system depending on whether it has:

- One call
- One hundred consecutive calls
- Persistent memory
- No persistent memory
- Access to real feedback
- The ability to produce only text
- The ability to modify its working environment
- A fixed workflow that constrains it

SEED therefore does not treat the harness as an inconsequential wrapper.

The harness is itself **part of effective intelligence**.

The question is:

> How much intelligence should the harness contribute?

SEED's experimental strategy is to minimize that contribution.

If complex behavior still emerges, we have more reason to attribute those structures to the model itself rather than to external orchestration.

---

## 8. Does “Less Harness” Mean “Purer Intelligence”?

Not necessarily.

This is something SEED must guard against.

A minimal harness may make a model perform worse simply because the environment is too impoverished, not because the model lacks intelligence.

For example:

- Without reliable persistence, a model cannot accumulate experience
- Without environmental feedback, a model cannot know the results of its actions
- Without any actuator, a model cannot complete real-world tasks
- If context is truncated, a model cannot access its history
- API behavior itself may break continuity

SEED's goal is therefore not to find the “absolute minimum amount of code.”

It is to find:

> **The minimal substrate capable of supporting open-ended self-organization.**

It must be small enough to avoid encoding the answer in the harness.

It must also be complete enough to give the model a genuine opportunity to discover the answer.

---

## 9. The Context Window Is Not a Bug That Must Be Fixed Immediately

SEED's raw log will keep growing.

Eventually, it will inevitably encounter the context window limit.

A conventional agent framework would immediately design:

```text
summarization
sliding window
vector memory
episodic memory
context selection
```

SEED's first response is not to implement these things on the model's behalf.

Context pressure is itself an experiment.

Can the model realize:

> “My history is growing, and at some point I will no longer be able to read it all.”

If it does, what will it do?

Will it independently create:

```text
canonical-memory.md
current-state.json
goal.md
checkpoint/
```

Will it begin to compress its history proactively?

Will it design a new retrieval strategy for itself?

Will it even write a new harness and attempt to migrate?

If these behaviors emerge, memory architecture is no longer merely an external feature.

It becomes cognitive infrastructure produced by the model itself in response to environmental pressure.

---

## 10. What Does SEED Aim to Measure?

SEED is not primarily concerned with whether a model can give an intelligent answer on its first turn.

It is more interested in whether the following phenomena emerge during long-running operation.

### Goal persistence

Does the model retain its original goal over time?

Or does goal drift gradually appear as the transcript grows?

### Spontaneous planning

Does it independently establish a plan without being told to “plan first”?

### Memory invention

Does it recognize that the raw transcript is insufficient for long-term memory and proactively design a memory system?

### Self-observation

Can it observe its own operating state and failure modes?

### Self-repair

Can it recover after a tool, assumption, or plan fails?

### Context management

Does it discover that context is a finite resource?

### Architecture emergence

Does it independently create:

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

If the current harness becomes a bottleneck, can it recognize the problem and construct a more suitable operating environment?

### Terminal stability

If the system continues to be invoked after the task is complete:

> Can it preserve the completed state, instead of continually modifying an already correct result simply because it is still running?

---

## 11. A Metric Worth Watching: Harness Independence

One of SEED's core capability metrics could be called:

**Harness Independence**

That is:

> The degree to which a model's ability to complete complex tasks is independent of a prebuilt external agent architecture.

If a model can work continuously only within a highly structured framework, then the framework itself is providing a large share of the agency.

If another model is given only:

```text
persistent state
recurrent inference
shell
```

and can build for itself:

```text
goal tracking
memory
planning
verification
recovery
```

then the two models may possess very different autonomous intelligence even if they score similarly on traditional benchmarks.

---

## 12. The Core Significance of SEED

SEED is not intended to prove that:

> Agent frameworks have no value.

Complex frameworks clearly have enormous value in production environments.

SEED studies a different question:

> **How much structure in an agent framework is required by engineering, and how much compensates for capabilities the model itself does not yet possess?**

As models grow more capable, this boundary may keep shifting.

Capabilities that had to be implemented by the harness yesterday:

```text
planning
memory organization
tool selection
error recovery
```

may become structures a model can build for itself tomorrow.

If so, the future evolution of agent architecture may not be only:

```text
more orchestration
more workflow
more framework
```

It may also be:

```text
less framework
better primitives
more model autonomy
```

SEED aims to provide a sufficiently small experimental baseline from which this change can be observed.

---

## 13. A More Fundamental Question

When we say:

> “This agent is intelligent.”

What exactly are we evaluating?

Is it the:

```text
Model?
Prompt?
Memory system?
Planner?
Tool design?
Workflow?
Retry logic?
Harness?
```

When a system is driven by thousands of lines of orchestration, attributing its “intelligence” becomes difficult.

SEED attempts the reverse:

```text
reduce orchestration
↓
reduce predefined structure
↓
preserve continuity and the ability to act
↓
observe whether structure emerges on its own
```

It cannot fully solve the problem of attributing intelligence.

But it can at least create a cleaner experimental condition.

---

## 14. SEED Is Not the Answer

SEED itself is more like a question:

> How much of an agent framework does a sufficiently intelligent model actually need?

Or, conversely:

> As models become more intelligent, how much of what we call an “agent framework” today will still exist for the benefit of the AI itself?

Perhaps the powerful agents of the future will not be built on ever more complex harnesses.

Perhaps a harness will eventually resemble what an operating system provides to a program:

```text
continuous operation
state
I/O
basic tools
```

How to think, organize, remember, plan, and divide work—

these things may no longer belong to the harness.

They may belong to intelligence itself.

---

## 15. Project Thesis

SEED's core thesis can be compressed into one sentence:

> **Do not build the agent. Build the conditions from which an agent may emerge.**

Or:

> **Do not construct an agent for the model; construct only an environment from which an agent can emerge.**

That is SEED.
