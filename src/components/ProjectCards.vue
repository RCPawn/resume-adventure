<!-- src/components/ProjectCard.vue -->
<template>
  <div class="project">
    <img :src="project.image" alt="Project Image" class="project-image" loading="lazy" />
    <div class="details">
      <h3 class="project-title">{{ project.name }}</h3>
      <p class="project-description">{{ project.description }}</p>
      <RouterLink :to="project.link" class="view-details">View Details</RouterLink>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  project: {
    type: Object,
    required: true
  }
});
</script>

<style scoped>
.project {
  background-color: #fff;
  border-radius: 5px;
  margin-bottom: 15px;
  position: relative;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
}

.project:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.15);
}

.project-image {
  width: 100%;
  display: block;
  transition: transform 0.3s ease;
}

.project:hover .project-image {
  transform: scale(1.05);
}

.details {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
  color: #fff;
  padding: 15px;
  opacity: 0;
  transform: translateY(100%);
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.project:hover .details {
  opacity: 1;
  transform: translateY(0);
}

.project-title {
  margin: 0 0 5px;
  font-size: 1.2rem;
}

.project-description {
  font-size: 0.9rem;
  margin-bottom: 10px;
}

.view-details {
  color: #ff9800;
  text-decoration: none;
  font-weight: bold;
  font-size: 0.9rem;
  transition: color 0.3s ease;
}

.view-details:hover {
  color: #fff;
}
</style>
