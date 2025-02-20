<template>
  <div class="gateway-container">
    <GoBackButton class="custom-go-back-btn" />

    <!-- Game Portal (Left) -->
    <div class="game-portal" @mousemove="handleGameHover" @click="navigateToGame">
      <div class="portal-content" :style="gameTransform">
        <h2 class="portal-title animate-fade-in">Resume Adventure</h2>
        <div class="planet-container">
          <div class="planet">
            <div class="crater crater-1"></div>
            <div class="crater crater-2"></div>
            <div class="crater crater-3"></div>
            <div class="glow"></div>
          </div>
        </div>
        <p class="portal-description animate-slide-up">
          Drive through my project experiences and GitHub contributions in this Unity 3D game!
        </p>
        <div class="particle" v-for="(p, i) in particles" :key="i" :style="particleStyle(p)"></div>
      </div>
    </div>

    <!-- Projects Portal (Right) -->
    <div class="projects-portal" @mousemove="handleProjectsHover" @click="navigateToProjects">
      <div class="portal-content" :style="projectsTransform">
        <h2 class="portal-title animate-fade-in">Projects</h2>
        <div class="cube-container">
          <div class="cube">
            <div class="face front"></div>
            <div class="face back"></div>
            <div class="face left"></div>
            <div class="face right"></div>
            <div class="face top"></div>
            <div class="face bottom"></div>
          </div>
        </div>
        <p class="portal-description animate-slide-up">
          Explore my full-stack projects, GitHub contributions, Blender creations, PyTorch experiments, and skills roadmap.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import GoBackButton from '@/components/GoBackButton.vue';

const router = useRouter();
const mouseX = ref(0);
const mouseY = ref(0);
const projMouseX = ref(0);
const projMouseY = ref(0);
const particles = ref([]);

const gameTransform = computed(() => ({
  transform: `rotateY(${(mouseX.value - 0.5) * 15}deg) rotateX(${(mouseY.value - 0.5) * -15}deg) scale(1.1)`,
  filter: `brightness(${1 + (0.5 - Math.abs(mouseX.value - 0.5)) * 0.5})`,
}));

const projectsTransform = computed(() => ({
  transform: `rotateY(${(projMouseX.value - 0.5) * 15}deg) rotateX(${(projMouseY.value - 0.5) * -15}deg) scale(1.1)`,
  filter: `brightness(${1 + (0.5 - Math.abs(projMouseX.value - 0.5)) * 0.5})`,
}));

const handleGameHover = (e) => {
  const rect = e.currentTarget.getBoundingClientRect();
  mouseX.value = (e.clientX - rect.left) / rect.width;
  mouseY.value = (e.clientY - rect.top) / rect.height;
};

const handleProjectsHover = (e) => {
  const rect = e.currentTarget.getBoundingClientRect();
  projMouseX.value = (e.clientX - rect.left) / rect.width;
  projMouseY.value = (e.clientY - rect.top) / rect.height;
};

const createParticles = () => {
  for (let i = 0; i < 40; i++) {
    particles.value.push({
      x: Math.random(),
      y: Math.random(),
      size: Math.random() * 3 + 1,
      speed: Math.random() * 0.02 + 0.01,
      delay: Math.random() * 2,
    });
  }
};

const particleStyle = (p) => ({
  left: `${p.x * 100}%`,
  top: `${p.y * 100}%`,
  width: `${p.size}px`,
  height: `${p.size}px`,
  animation: `float ${5 / p.speed}s linear infinite`,
  animationDelay: `${p.delay}s`,
});

const navigateToGame = () => {
  router.push('/projects/adventure');
};

const navigateToProjects = () => {
  router.push('/gateway/projects');
};

onMounted(() => {
  createParticles();
});
</script>

<style scoped>
.gateway-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 100vh;
  font-family: 'Helvetica Neue', Arial, sans-serif;
  color: #2d3436;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.custom-go-back-btn {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 10;
}

.game-portal,
.projects-portal {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  transition: all 0.3s ease;
  cursor: pointer;
}

.game-portal {
  position: relative;
  background: rgba(52, 73, 94, 0.1);
}

.game-portal:hover {
  background: rgba(52, 73, 94, 0.2);
}

.projects-portal {
  position: relative;
  background: rgba(46, 204, 113, 0.1);
}

.projects-portal:hover {
  background: rgba(46, 204, 113, 0.2);
}

.portal-content {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  text-align: center;
  transition: transform 0.3s ease-out;
  min-height: 400px;
  width: 100%;
}

.portal-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #34495e;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  margin: 0;
}

.portal-description {
  font-size: 1.2rem;
  color: #2d3436;
  max-width: 80%;
  line-height: 1.6;
  margin: 0;
}

/* Planet Styling (Left) */
.planet-container {
  width: 150px;
  height: 150px;
  animation: rotatePlanet 20s linear infinite;
}

.planet {
  position: relative;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 30% 30%, #5dade2 0%, #2c3e50 100%);
  border-radius: 50%;
  box-shadow: 0 0 40px rgba(52, 152, 219, 0.5), inset 0 0 20px rgba(0, 0, 0, 0.3);
}

.crater {
  position: absolute;
  background: rgba(0, 0, 0, 0.15);
  border-radius: 50%;
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
}

.crater-1 { width: 30px; height: 30px; top: 20%; left: 60%; }
.crater-2 { width: 20px; height: 20px; top: 50%; left: 30%; }
.crater-3 { width: 15px; height: 15px; top: 70%; left: 70%; }

.glow {
  position: absolute;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.4), transparent 50%);
  border-radius: 50%;
}

/* Cube Styling (Right) */
.cube-container {
  width: 150px;
  height: 150px;
  perspective: 1000px;
}

.cube {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  animation: rotateCube 20s linear infinite;
}

.face {
  position: absolute;
  width: 150px;
  height: 150px;
  background: radial-gradient(circle, #2ecc71 0%, #27ae60 100%);
  opacity: 0.85;
  box-shadow: 0 0 30px rgba(46, 204, 113, 0.5);
}

.front  { transform: translateZ(75px); }
.back   { transform: translateZ(-75px) rotateY(180deg); }
.left   { transform: translateX(-75px) rotateY(-90deg); }
.right  { transform: translateX(75px) rotateY(90deg); }
.top    { transform: translateY(-75px) rotateX(90deg); }
.bottom { transform: translateY(75px) rotateX(-90deg); }

/* Particles */
.particle {
  position: absolute;
  background: #ffffff;
  border-radius: 50%;
  opacity: 0.6;
}

/* Animations */
@keyframes rotatePlanet {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes rotateCube {
  from { transform: rotateX(0deg) rotateY(0deg); }
  to { transform: rotateX(360deg) rotateY(360deg); }
}

@keyframes float {
  0% { transform: translateY(0px); opacity: 0.6; }
  50% { transform: translateY(-15px); opacity: 0.3; }
  100% { transform: translateY(0px); opacity: 0.6; }
}
</style>
