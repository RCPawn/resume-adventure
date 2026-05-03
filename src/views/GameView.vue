<template>
  <div class="game-page">
    <GoBackButton />

    <main class="game-page__main">
      <div ref="gameFrameRef" class="game-frame">
        <div v-if="loading" class="loading-state">
          <div class="spinner" aria-hidden="true"></div>
        </div>
        <iframe
          v-show="!loading"
          ref="iframeRef"
          :src="gameUrl"
          class="game-iframe"
          title="游戏"
          allow="fullscreen; gamepad"
          @load="onGameLoaded"
        />
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import GoBackButton from '@/components/GoBackButton.vue';

const HINT_ID = 'resume-game-fs-hint';

const gameUrl = ref('/WebGL Builds/index.html');
const loading = ref(true);
const gameFrameRef = ref(null);
const iframeRef = ref(null);

let hintTimers = [];
let detachParentFs = null;
let detachIframeFs = null;
let bodyOverflowPrev = '';

function getFullscreenElement(doc) {
  return (
    doc.fullscreenElement ||
    doc.webkitFullscreenElement ||
    doc.mozFullScreenElement ||
    null
  );
}

function clearHintTimers() {
  hintTimers.forEach((id) => clearTimeout(id));
  hintTimers = [];
}

function removeHintInDoc(doc) {
  if (!doc) return;
  try {
    doc.getElementById(HINT_ID)?.remove();
  } catch {
    /* ignore */
  }
}

/**
 * 全屏时只有 fullscreenElement 及其子节点会参与绘制，
 * 提示必须挂在该节点下，挂 body 会被盖住。
 */
function showFullscreenHintInDoc(doc) {
  if (!doc) return;

  let root = getFullscreenElement(doc);
  if (!root || root.nodeType !== Node.ELEMENT_NODE) return;
  if (root === doc.documentElement) root = doc.body;

  removeHintInDoc(doc);
  clearHintTimers();

  const bar = doc.createElement('div');
  bar.id = HINT_ID;
  bar.setAttribute('role', 'status');
  bar.setAttribute('aria-live', 'polite');
  bar.textContent = '按 Esc 退出全屏';

  Object.assign(bar.style, {
    position: 'fixed',
    left: '50%',
    bottom: 'max(14px, env(safe-area-inset-bottom, 0px))',
    transform: 'translateX(-50%)',
    zIndex: '2147483647',
    maxWidth: 'calc(100vw - 24px)',
    padding: '8px 14px',
    borderRadius: '6px',
    fontSize: '13px',
    fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif',
    fontWeight: '600',
    color: '#fff',
    background: 'rgba(0,0,0,0.82)',
    boxShadow: '0 4px 16px rgba(0,0,0,0.35)',
    pointerEvents: 'none',
    textAlign: 'center',
    opacity: '0',
    transition: 'opacity 0.25s ease',
  });

  root.appendChild(bar);
  requestAnimationFrame(() => {
    bar.style.opacity = '1';
  });

  hintTimers.push(
    window.setTimeout(() => {
      bar.style.opacity = '0';
      hintTimers.push(
        window.setTimeout(() => {
          bar.remove();
        }, 280),
      );
    }, 5200),
  );
}

function onIframeDocFullscreenChange() {
  const iframe = iframeRef.value;
  let doc = null;
  try {
    doc = iframe?.contentDocument ?? null;
  } catch {
    return;
  }
  if (!doc) return;

  if (getFullscreenElement(doc)) {
    requestAnimationFrame(() => showFullscreenHintInDoc(doc));
  } else {
    removeHintInDoc(doc);
    clearHintTimers();
  }
}

function onParentDocFullscreenChange() {
  const el = getFullscreenElement(document);
  const frame = gameFrameRef.value;
  const iframe = iframeRef.value;

  if (!el) {
    removeHintInDoc(document);
    clearHintTimers();
    return;
  }

  if (iframe && el === iframe) {
    try {
      const idoc = iframe.contentDocument;
      if (idoc) {
        const tryShow = (attempt) => {
          if (getFullscreenElement(idoc)) {
            showFullscreenHintInDoc(idoc);
            return;
          }
          if (attempt < 10) {
            hintTimers.push(window.setTimeout(() => tryShow(attempt + 1), 50));
          }
        };
        requestAnimationFrame(() => tryShow(0));
      }
    } catch {
      /* 跨域无法读 iframe 文档 */
    }
    return;
  }

  if (frame && (el === frame || frame.contains(el))) {
    requestAnimationFrame(() => showFullscreenHintInDoc(document));
  }
}

function attachIframeFullscreenListeners() {
  const iframe = iframeRef.value;
  if (!iframe) return;
  let doc = null;
  try {
    doc = iframe.contentDocument;
  } catch {
    return;
  }
  if (!doc) return;

  doc.addEventListener('fullscreenchange', onIframeDocFullscreenChange);
  doc.addEventListener('webkitfullscreenchange', onIframeDocFullscreenChange);
  doc.addEventListener('mozfullscreenchange', onIframeDocFullscreenChange);
  detachIframeFs = () => {
    doc.removeEventListener('fullscreenchange', onIframeDocFullscreenChange);
    doc.removeEventListener('webkitfullscreenchange', onIframeDocFullscreenChange);
    doc.removeEventListener('mozfullscreenchange', onIframeDocFullscreenChange);
    removeHintInDoc(doc);
    detachIframeFs = null;
  };
}

function attachParentFullscreenListeners() {
  document.addEventListener('fullscreenchange', onParentDocFullscreenChange);
  document.addEventListener('webkitfullscreenchange', onParentDocFullscreenChange);
  document.addEventListener('mozfullscreenchange', onParentDocFullscreenChange);
  detachParentFs = () => {
    document.removeEventListener('fullscreenchange', onParentDocFullscreenChange);
    document.removeEventListener('webkitfullscreenchange', onParentDocFullscreenChange);
    document.removeEventListener('mozfullscreenchange', onParentDocFullscreenChange);
    removeHintInDoc(document);
    detachParentFs = null;
  };
}

const onGameLoaded = () => {
  loading.value = false;
  detachIframeFs?.();
  attachIframeFullscreenListeners();
};

onMounted(() => {
  bodyOverflowPrev = document.body.style.overflow;
  document.body.style.overflow = 'hidden';
  attachParentFullscreenListeners();
});

onBeforeUnmount(() => {
  document.body.style.overflow = bodyOverflowPrev;
  clearHintTimers();
  detachParentFs?.();
  detachIframeFs?.();
  removeHintInDoc(document);
  try {
    removeHintInDoc(iframeRef.value?.contentDocument);
  } catch {
    /* ignore */
  }
});
</script>

<style scoped>
.game-page {
  --game-gutter: 12px;
  position: fixed;
  inset: 0;
  z-index: 0;
  display: flex;
  flex-direction: column;
  background: var(--bg-color);
  color: var(--text-color);
  font-family: var(--font-sans);
  overflow: auto;
}

@media (min-width: 600px) {
  .game-page {
    --game-gutter: 16px;
  }
}

.game-page__main {
  box-sizing: border-box;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 4.75rem var(--game-gutter) 12px;
  min-height: 0;
}

.game-frame {
  position: relative;
  width: min(
    calc(100vw - 2 * var(--game-gutter)),
    calc((100vh - 5.25rem) * 16 / 9)
  );
  aspect-ratio: 16 / 9;
  max-height: calc(100vh - 5.25rem);
  margin-inline: auto;
  border-radius: 4px;
  border: 1px solid var(--border-color);
  background: #000;
  overflow: hidden;
}

/* 整框全屏时允许子节点（提示条）不被裁切 */
.game-frame:fullscreen {
  overflow: visible;
}

.game-iframe {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: none;
  background: #000;
}

.loading-state {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0d0d0d;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 255, 255, 0.12);
  border-top-color: var(--primary-color);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 480px) {
  .game-page__main {
    padding-top: 4.25rem;
  }

  .game-frame {
    width: min(
      calc(100vw - 2 * var(--game-gutter)),
      calc((100vh - 4.85rem) * 16 / 9)
    );
    max-height: calc(100vh - 4.85rem);
  }
}
</style>
