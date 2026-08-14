export const locales = ['zh', 'en'] as const
export const defaultLocale: Locale = 'zh'

export type Locale = (typeof locales)[number]

export const translations = {
  zh: {
    meta: {
      title: 'SEED — 一生万物',
      description: '从最小循环中，让 Agent 自行出现。',
    },
    nav: {
      specimen: '自主智能实验 / 000',
      thesis: 'THESIS',
      github: 'GITHUB',
      language: 'EN',
      languageHref: '/en/',
      languageLabel: 'Switch to English',
    },
    hero: {
      index: 'SEED / 000',
      title: '一生万物',
      thesis: '不要构造 Agent。\n构造它出现的条件。',
      scroll: '向下 / 理念',
    },
    generator: {
      eyebrow: '生长舱 / LIVE',
      title: '生成 SEED',
      local: '配置与 API KEY 以明文保存在本浏览器 · 任务文本不保存 · 不发出请求',
      endpoint: 'API ENDPOINT',
      model: 'MODEL',
      modelPlaceholder: 'YOUR_MODEL',
      codeLanguage: '运行环境',
      nodejs: 'Node.js',
      python: 'Python',
      key: 'API KEY',
      keyPlaceholder: 'sk-...',
      goal: 'GOAL',
      goalPlaceholder: '它要完成什么？',
      advanced: '编辑初始种子',
      bootstrap: 'BOOTSTRAP',
      showKey: '显示',
      hideKey: '隐藏',
      outputNodejs: 'NODE 18+ / STDIN',
      outputPython: 'PYTHON 3 / STDIN',
      copy: '复制 SEED',
      copied: '已复制',
      copyFailed: '复制失败',
      bootstrapValue: `你正在一个循环中运行。
你的回答会被原样追加到这段文本。
随后，你将携带完整的新文本再次被调用。
如此往复。

目标：

{{TASK}}`,
    },
    concepts: {
      eyebrow: '最小条件 / 003',
      action: '展开',
      items: [
        {
          number: '01',
          title: 'RECUR',
          text: '输出，再次成为输入。',
          description: '每一次回答都进入下一轮。连续性，从一个循环开始。',
        },
        {
          number: '02',
          title: 'ACCUMULATE',
          text: '经历，成为状态。',
          description: '不预设记忆架构。如何组织历史，由模型决定。',
        },
        {
          number: '03',
          title: 'EMERGE',
          text: '结构，由智能发明。',
          description: '没有 Planner，没有 Workflow。只观察智能会创造什么。',
        },
      ],
    },
    finale: {
      index: 'THESIS / 001',
      lineOne: 'LESS HARNESS.',
      lineTwo: 'MORE AUTONOMY.',
      coda: '一生万物',
    },
    footer: {
      note: 'SEED / OPEN EXPERIMENT',
      source: 'SOURCE',
    },
  },
  en: {
    meta: {
      title: 'SEED — One Becomes All',
      description: 'Let an agent emerge from the smallest possible loop.',
    },
    nav: {
      specimen: 'AUTONOMY STUDY / 000',
      thesis: 'THESIS',
      github: 'GITHUB',
      language: '中文',
      languageHref: '/zh/',
      languageLabel: '切换到中文',
    },
    hero: {
      index: 'SEED / 000',
      title: 'ONE\nBECOMES ALL',
      thesis: 'DO NOT BUILD THE AGENT.\nBUILD THE CONDITIONS.',
      scroll: 'DESCEND / THESIS',
    },
    generator: {
      eyebrow: 'GROWTH CHAMBER / LIVE',
      title: 'GENERATE SEED',
      local: 'CONFIG + API KEY STORED UNENCRYPTED IN THIS BROWSER · GOAL NOT STORED · NO REQUESTS',
      endpoint: 'API ENDPOINT',
      model: 'MODEL',
      modelPlaceholder: 'YOUR_MODEL',
      codeLanguage: 'RUNTIME',
      nodejs: 'Node.js',
      python: 'Python',
      key: 'API KEY',
      keyPlaceholder: 'sk-...',
      goal: 'GOAL',
      goalPlaceholder: 'What must emerge?',
      advanced: 'EDIT INITIAL SEED',
      bootstrap: 'BOOTSTRAP',
      showKey: 'SHOW',
      hideKey: 'HIDE',
      outputNodejs: 'NODE 18+ / STDIN',
      outputPython: 'PYTHON 3 / STDIN',
      copy: 'COPY SEED',
      copied: 'COPIED',
      copyFailed: 'COPY FAILED',
      bootstrapValue: `You are running in a loop.
Your response will be appended verbatim to this text.
You will then be invoked again with the entire resulting text.
This repeats indefinitely.

Goal:

{{TASK}}`,
    },
    concepts: {
      eyebrow: 'MINIMUM CONDITIONS / 003',
      action: 'OPEN',
      items: [
        {
          number: '01',
          title: 'RECUR',
          text: 'Output becomes input.',
          description: 'Every response enters the next cycle. Continuity begins with a loop.',
        },
        {
          number: '02',
          title: 'ACCUMULATE',
          text: 'Experience becomes state.',
          description: 'No memory architecture is prescribed. The model decides how history is shaped.',
        },
        {
          number: '03',
          title: 'EMERGE',
          text: 'Intelligence invents structure.',
          description: 'No planner. No workflow. Only the conditions to see what intelligence creates.',
        },
      ],
    },
    finale: {
      index: 'THESIS / 001',
      lineOne: 'LESS HARNESS.',
      lineTwo: 'MORE AUTONOMY.',
      coda: 'ONE BECOMES ALL',
    },
    footer: {
      note: 'SEED / OPEN EXPERIMENT',
      source: 'SOURCE',
    },
  },
} as const

export type Copy = (typeof translations)[Locale]
