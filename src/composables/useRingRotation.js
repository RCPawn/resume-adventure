import { ref, computed, onMounted, onBeforeUnmount } from 'vue';

export function useRingRotation(projects) {
    const rotation = ref(0);
    const intervalId = ref(null);
    const radius = ref(300);
    const initialDragRotation = ref(0);
    const initialMouseX = ref(0);

    const rotationStep = computed(() => 360 / projects.length);

    const activeIndex = computed(() => {
        let normalizedRotation = ((-rotation.value) % 360 + 360) % 360;
        return Math.round(normalizedRotation / rotationStep.value) % projects.length;
    });
    const indicatorActiveIndex = computed(() => activeIndex.value);

    const itemStyle = (index) => {
        const angle = (360 / projects.length) * index;
        return {
            transform: `rotateY(${angle}deg) translateZ(${radius.value}px)`,
            filter: index === activeIndex.value ? 'brightness(1.2)' : 'brightness(0.9)',
            transition: 'transform 0.5s ease, filter 0.5s ease'
        };
    };

    const startAutoRotation = () => {
        if (intervalId.value) return;
        intervalId.value = setInterval(() => {
            rotation.value -= 0.5;
        }, 30);
    };

    const stopAutoRotation = () => {
        clearInterval(intervalId.value);
        intervalId.value = null;
    };

    const startDrag = (e) => {
        stopAutoRotation();
        initialDragRotation.value = rotation.value;
        initialMouseX.value = e.clientX;
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', stopDrag);
    };

    const drag = (e) => {
        const deltaX = e.clientX - initialMouseX.value;
        rotation.value = initialDragRotation.value - (deltaX * 0.1);
    };

    const stopDrag = () => {
        document.removeEventListener('mousemove', drag);
        document.removeEventListener('mouseup', stopDrag);
        startAutoRotation();
    };

    const goToIndex = (indicatorIndex) => {
        stopAutoRotation();
        rotation.value = -indicatorIndex * rotationStep.value;
        setTimeout(() => {
            startAutoRotation();
        }, 1000);
    };

    onMounted(() => {
        startAutoRotation();
    });
    onBeforeUnmount(() => {
        stopAutoRotation();
    });

    return {
        rotation,
        itemStyle,
        startDrag,
        drag,
        stopDrag,
        startAutoRotation,
        stopAutoRotation,
        goToIndex,
        indicatorActiveIndex
    };
}
