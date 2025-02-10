import { ref, computed, onMounted, onBeforeUnmount } from 'vue';

export function useRingRotation(projects) {
    const rotation = ref(0);
    const intervalId = ref(null);
    const radius = ref(300);

    // 每个卡片占据的角度
    const rotationStep = computed(() => 360 / projects.length);

    // 计算正对前方的卡片索引
    const activeIndex = computed(() => {
        let normalizedRotation = ((-rotation.value) % 360 + 360) % 360;
        return Math.round(normalizedRotation / rotationStep.value) % projects.length;
    });
    const indicatorActiveIndex = computed(() => activeIndex.value);

    // 每个卡片的样式
    const itemStyle = (index) => {
        const angle = rotationStep.value * index;
        return {
            transform: `rotateY(${angle}deg) translateZ(${radius.value}px)`,
            filter: index === activeIndex.value ? 'brightness(1.2)' : 'brightness(0.9)',
            transition: 'transform 0.5s ease, filter 0.5s ease'
        };
    };

    // 启动自动旋转
    const startAutoRotation = () => {
        if (intervalId.value) return;
        intervalId.value = setInterval(() => {
            rotation.value -= 0.5;
        }, 30);
    };

    // 停止自动旋转
    const stopAutoRotation = () => {
        clearInterval(intervalId.value);
        intervalId.value = null;
    };

    // 点击指示器时，直接对齐到目标卡片，并停止自动旋转
    const goToIndex = (indicatorIndex) => {
        stopAutoRotation();
        rotation.value = -indicatorIndex * rotationStep.value;
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
        startAutoRotation,
        stopAutoRotation,
        goToIndex,
        indicatorActiveIndex
    };
}
