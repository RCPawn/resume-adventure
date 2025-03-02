<template>
  <aside class="repo-list">
    <!-- 搜索输入框 -->
    <input
        type="text"
        v-model="searchQueryLocal"
        placeholder="搜索仓库..."
        class="search-input"
    />
    <!-- 遍历各个分组 -->
    <div
        v-for="(repos, category) in groupedRepositories"
        :key="category"
        class="repo-category"
    >
      <h3 class="category-title">{{ category }}</h3>
      <div
          v-for="repo in repos"
          :key="repo.id"
      >
        <RepoCard
            :repo="repo"
            :active="activeRepo && activeRepo.id === repo.id"
            @click="selectRepo(repo)"
        />
      </div>
    </div>
  </aside>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import RepoCard from './RepoCard.vue';

const props = defineProps({
  repositories: {
    type: Array,
    default: () => []
  },
  searchQuery: {
    type: String,
    default: ""
  },
  activeRepo: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['repo-selected', 'update:searchQuery']);

// 为本组件创建独立的搜索关键字响应式数据
const searchQueryLocal = ref(props.searchQuery);
watch(searchQueryLocal, (newVal) => {
  emit('update:searchQuery', newVal);
});

// 根据仓库名称或 README 内容判断分组类别
const getCategory = (repo) => {
  const name = repo.repoName.toLowerCase();
  const readme = repo.repoReadme.toLowerCase();
  if (name.includes("leetcode")) {
    return "算法刷题";
  }
  if (name.includes("pytorch") || name.includes("ai")) {
    return "深度学习";
  }
  if (
      name.includes("study") ||
      name.includes("code") ||
      readme.includes("study") ||
      readme.includes("tutorial")
  ) {
    return "学习与实验";
  }
  return "其他项目";
};

// 过滤仓库数据
const filteredRepositories = computed(() => {
  return props.repositories.filter(repo =>
      repo.repoName.toLowerCase().includes(searchQueryLocal.value.toLowerCase())
  );
});

// 分组后的仓库数据
const groupedRepositories = computed(() => {
  const groups = {};
  filteredRepositories.value.forEach(repo => {
    const category = getCategory(repo);
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(repo);
  });
  return groups;
});

// 点击仓库卡片时通知父组件
const selectRepo = (repo) => {
  emit('repo-selected', repo);
};
</script>

<style scoped>
.repo-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow-y: auto;
  max-height: 80vh;
  border-right: 1px solid #e0e0e0;
  padding-right: 1rem;
}
.search-input {
  padding: 0.5rem;
  margin-bottom: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}
.repo-category {
  margin-bottom: 1rem;
}
.category-title {
  font-size: 1.2rem;
  color: #333;
  margin-bottom: 0.5rem;
  border-bottom: 2px solid #42b983;
  padding-bottom: 0.3rem;
}
</style>
