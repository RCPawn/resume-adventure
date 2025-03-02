<template>
  <div :class="['repo-card', { active }]" @click="$emit('click')">
    <h4>{{ repo.repoName }}</h4>
    <p class="description">{{ repo.repoDescription }}</p>
    <div class="repo-stats" v-if="repo.stars || repo.forks">
      <span v-if="repo.stars">⭐ {{ repo.stars }}</span>
      <span v-if="repo.forks">🍴 {{ repo.forks }}</span>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  repo: {
    type: Object,
    required: true
  },
  active: {
    type: Boolean,
    default: false
  }
});
</script>

<style scoped>
.repo-card {
  padding: 1rem;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: background 0.3s, transform 0.3s, box-shadow 0.3s;
  margin-bottom: 0.5rem;
}
.repo-card:hover {
  background: #f9f9f9;
  transform: translateX(5px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}
.repo-card.active {
  border-left: 4px solid #42b983;
  background: #eefaf2;
}
.description {
  color: #555;
  font-size: 0.9rem;
  margin-top: 0.5rem;
}
.repo-stats {
  margin-top: 0.5rem;
  font-size: 0.85rem;
  color: #888;
}
.repo-stats span {
  margin-right: 1rem;
}
</style>
