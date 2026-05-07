<script setup>
import ShareLibraryPanel from '@/components/ShareLibraryPanel.vue'
</script>

<template>
  <div class="share-page">
    <div class="share-viewport">
      <ShareLibraryPanel />
    </div>
  </div>
</template>

<style scoped>
.share-page {
  min-height: 100vh;
  min-height: 100dvh;
  background-color: var(--bg-color);
  color: var(--text-color);
}

.share-viewport {
  width: 100%;
  position: relative;
  padding: max(clamp(12px, 2vw, 28px), env(safe-area-inset-top, 0px)) 0 clamp(40px, 7vh, 88px);
  box-sizing: border-box;
}
</style>
