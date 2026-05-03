import { CHAT_HISTORY_KEY, CHAT_HISTORY_MAX } from './constants.js';

function newId() {
  return typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : `msg-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function normalizeMessage(raw, index) {
  if (!raw || typeof raw !== 'object') {
    return null;
  }
  const type = raw.type === 'user' ? 'user' : 'ai';
  const ts = typeof raw.timestamp === 'number' && !Number.isNaN(raw.timestamp)
    ? raw.timestamp
    : Date.now();
  return {
    id: raw.id || `legacy-${ts}-${index}`,
    content: typeof raw.content === 'string' ? raw.content : '',
    type,
    timestamp: ts
  };
}

const defaultWelcome = () => ({
  id: 'welcome',
  content: '你好！我是 rcpawn 的小助手，有什么可以帮你的吗？',
  type: 'ai',
  timestamp: Date.now()
});

export function loadChatHistory() {
  try {
    const saved = localStorage.getItem(CHAT_HISTORY_KEY);
    if (!saved) {
      return [defaultWelcome()];
    }
    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return [defaultWelcome()];
    }
    const list = parsed
      .map(normalizeMessage)
      .filter(Boolean);
    if (list.length === 0) {
      return [defaultWelcome()];
    }
    return list;
  } catch {
    return [defaultWelcome()];
  }
}

export function saveChatHistory(messages) {
  const trimmed = Array.isArray(messages)
    ? messages.slice(-CHAT_HISTORY_MAX)
    : [];
  try {
    localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(trimmed));
  } catch {
    // 配额满或隐私模式：忽略，避免打断聊天
  }
}

export { newId };
