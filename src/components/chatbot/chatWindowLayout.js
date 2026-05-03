import {
  CHAT_FAB_SIZE,
  CHAT_WINDOW_FAB_GAP,
  CHAT_WINDOW_MARGIN
} from './constants.js';

/**
 * 紧贴 FAB 左侧摆放；窗口右缘不超过 fabLeft - gap。
 */
export function placeWindowBesideFab(fabLeft, fabTop, windowWidth, windowHeight) {
  const gap = CHAT_WINDOW_FAB_GAP;
  const m = CHAT_WINDOW_MARGIN;
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  const maxW = fabLeft - gap - m;
  let w = windowWidth;
  if (w > maxW) {
    w = Math.max(0, maxW);
  }

  let h = windowHeight;

  let x = fabLeft - w - gap;
  x = Math.max(m, Math.min(x, vw - w - m));

  const maxXBeforeFab = fabLeft - gap - w;
  x = Math.min(x, maxXBeforeFab);
  x = Math.max(m, x);

  let y = fabTop + CHAT_FAB_SIZE / 2 - h / 2;
  y = Math.max(m, Math.min(y, vh - h - m));

  return { x, y, width: w, height: h };
}

export function clampWindowPosition(pos, windowWidth, windowHeight, fabLeft) {
  const gap = CHAT_WINDOW_FAB_GAP;
  const m = CHAT_WINDOW_MARGIN;
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  const maxX = Math.min(vw - windowWidth - m, fabLeft - gap - windowWidth);
  const x = Math.max(m, Math.min(pos.x, maxX));
  const y = Math.max(m, Math.min(pos.y, vh - windowHeight - m));

  return { x, y };
}
