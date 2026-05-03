/** 悬浮 AI 按钮边长（与 ChatbotButton 样式一致） */
export const CHAT_FAB_SIZE = 60;
/** 超过此位移视为拖拽，不触发打开/关闭 */
export const CHAT_DRAG_THRESHOLD_PX = 8;
export const CHAT_HISTORY_KEY = 'chat_history';
/** 避免 localStorage 膨胀与深度 watch 过重 */
export const CHAT_HISTORY_MAX = 100;
/** 持久化防抖（ms） */
export const CHAT_PERSIST_DEBOUNCE_MS = 400;

/** 弹窗右缘与 FAB 左缘之间的空隙（避免遮挡触发器） */
export const CHAT_WINDOW_FAB_GAP = 14;
/** 弹窗距视口边缘的安全边距 */
export const CHAT_WINDOW_MARGIN = 10;
/** 默认宽高（可被窄屏压缩）；高度略大以抵消精简顶栏底栏后的可视面积 */
export const CHAT_WINDOW_DEFAULT_WIDTH = 336;
export const CHAT_WINDOW_DEFAULT_HEIGHT = 496;
