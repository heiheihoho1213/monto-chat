export const DEFAULT_CONVERSATIONS_ITEMS = [
  {
    key: 'default-0',
    label: 'What is Monto chat?',
    group: 'Today',
  },
  {
    key: 'default-1',
    label: 'How to use Monto chat?',
    group: 'Today',
  },
  {
    key: 'default-2',
    label: '今天吃什么？',
    group: 'Yesterday',
  },
];

export const SENDER_PROMPTS = [
  {
    key: '1',
    label: '翻译成中文',
  },
  {
    key: '2',
    label: '翻译成英文',
  },
];

export const MODELS = [
  {
    key: 'deepseek-ai/DeepSeek-R1-0528-Qwen3-8B',
    label: 'DeepSeek-R1',
    url: 'chat/completions',
    type: 'text',
  },
  {
    key: 'Qwen/Qwen3-8B',
    label: '通义千问 v3',
    url: 'chat/completions',
    type: 'text',
  },
  {
    key: 'Kwai-Kolors/Kolors',
    label: '可图',
    url: 'images/generations',
    type: 'image',
  },
  {
    key: 'TeleAI/TeleSpeechASR',
    label: '星辰文本转语音',
    url: 'audio/speech',
    type: 'audio',
  },
]