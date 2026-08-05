<template>
    <div
        class="iconWrapper"
        @mouseenter="isHovered = true"
        @mouseleave="isHovered = false"
        @touchstart.passive="isHovered = true"
        @touchend.passive="isHovered = false"
    >
        <component
            :is="icon"
            class="morphIcon"
            :class="{ isActive: isHovered }"
            viewBox="0 0 250 224"
            width="100%"
            height="100%"
            preserveAspectRatio="xMidYMid meet"
        />
    </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
    icon: { 
        type: Object, 
        required: true 
    }
})

const isHovered = ref(false)
</script>

<style scoped>
.iconWrapper {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    width: 280px;
    height: 221px;
    cursor: pointer;
    perspective: 1000px;
}

.morphIcon,
:deep(svg) {
    width: 100% !important;
    height: 100% !important;
    max-width: 100%;
    max-height: 100%;
    display: block;
    overflow: visible;

    animation: continuousMorph 5s ease-in-out infinite alternate;
    transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.iconWrapper:hover .morphIcon,
.morphIcon.isActive {
    animation-play-state: paused;
    transform: scale(1.08) rotate(4deg);
}

@keyframes continuousMorph {
    0% {
        transform: scale(1, 1) rotate(0deg) skew(0deg, 0deg);
    }
    10% {
        transform: scale(1.04, 0.94) rotate(-2deg) skew(1deg, -1deg); 
    }
    20% {
        transform: scale(1.07, 0.91) rotate(-4deg) skew(2deg, -2deg); 
    }
    30% {
        transform: scale(0.95, 1.06) rotate(2deg) skew(-1deg, 2deg); 
    }
    40% {
        transform: scale(0.92, 1.09) rotate(5deg) skew(-2deg, 3deg); 
    }
    50% {
        transform: scale(1.03, 0.97) rotate(2deg) skew(1deg, -1deg); 
    }
    60% {
        transform: scale(1.05, 0.96) rotate(-3deg) skew(2deg, -1deg);
    }
    70% {
        transform: scale(0.97, 1.03) rotate(-1deg) skew(-1deg, 1deg);
    }
    80% {
        transform: scale(1.01, 0.99) rotate(1deg) skew(0deg, 0deg);
    }
    90% {
        transform: scale(0.99, 1.005) rotate(0.5deg) skew(0deg, 0deg);
    }
    100% {
        transform: scale(1, 1) rotate(0deg) skew(0deg, 0deg); 
    }
}

@media (max-width: 768px) {
    .iconWrapper {
        width: 145px;
        height: 130px;
        aspect-ratio: 29 / 26;
    }

    .morphIcon {
        width: 100%;
        height: 100%;
    }
}
</style>