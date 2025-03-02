<template>
  <GoBackButton/>
  <TopRightButtons/>
  <section class="github-view">
    <h1 class="page-title">我的 GitHub 仓库展示</h1>
    <div class="repo-container">
      <RepoList
          :repositories="repositories"
          v-model:searchQuery="searchQuery"
          :activeRepo="activeRepo"
          @repo-selected="handleRepoSelected"
      />
      <RepoDetail
          v-if="activeRepo"
          :repo="activeRepo"
      />
    </div>
  </section>
</template>

<script setup>
import {ref} from 'vue';
import githubData from "@/data/GitHub.json";
import GoBackButton from "@/components/GoBackButton.vue";
import TopRightButtons from "@/components/TopRightButtons.vue";
import RepoList from "@/components/github/RepoList.vue";
import RepoDetail from "@/components/github/RepoDetail.vue";

const repositories = ref(githubData || []);
const searchQuery = ref("");
const activeRepo = ref(repositories.value.length ? repositories.value[0] : null);

const handleRepoSelected = (repo) => {
  activeRepo.value = repo;
};
</script>

<style scoped>
.github-view {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  font-family: "Arial", sans-serif;
}

.page-title {
  text-align: center;
  margin-bottom: 1.5rem;
}

.repo-container {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 2rem;
}
</style>
