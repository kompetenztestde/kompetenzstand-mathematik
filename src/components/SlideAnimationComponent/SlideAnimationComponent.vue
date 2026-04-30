<script setup lang="ts">
import { ref, computed, onMounted, watch, onUnmounted } from 'vue'
import { DotLottieVue } from '@lottiefiles/dotlottie-vue'
import { type LevelLabel, LEVEL_MAP } from '@/types'
import styles from './styles.module.css'
import { useI18n } from 'vue-i18n'
import scene2Moving from '@/assets/animations/Scene_2_V2_moving.json'
import scene3 from '@/assets/animations/Scene_3.json'
import scene1_3 from '@/assets/animations/Sample_2_Scenes_1-3.json'

const { t } = useI18n()
const isMobile = ref(false)
const updateBreakpoint = () => {
    isMobile.value = window.innerWidth < 768
}

const props = defineProps<{
    level?: LevelLabel
    score: number
    correctScore: number
    areas?: number[]
}>()

const step = ref(1)
const isSliding = ref(false)

const dynamicMask = computed(() => {
    const a1 = props.areas?.[0] ?? 33
    const a2 = props.areas?.[1] ?? 66

    return `linear-gradient(to right, 
        rgba(0, 0, 0, 1) 0%, 
        rgba(0, 0, 0, 1) ${a1}%, 
        rgba(0, 0, 0, 0.75) ${a1}%, 
        rgba(0, 0, 0, 0.75) ${a2}%, 
        rgba(0, 0, 0, 0.4) ${a2}%, 
        rgba(0, 0, 0, 0.4) 100%
    )`
})

const currentScore = computed(() => {
    if (!props.level) {
        return 1
    }
    return LEVEL_MAP[props.level]
})

watch(props, (newVal) => {
    if (newVal) {
        console.log('Value:', props.areas)
    }
})

const isIntroSliding = ref(false)

const calculatedPercentage = computed(() => {
    const total = 43
    return (props.correctScore / total) * 100
})

const dynamicLeftPosition = computed(() => {
    const width = window.innerWidth
    const height = window.innerHeight
    if (step.value === 1) {
        if (isIntroSliding.value) {
            return '120%'
        }

        if (width < 500) {
            return '0%'
        }
        if (width <= 650 && width >= 500) {
            return '-12%'
        }
        if (width >= 650 && width < 768) {
            return '-17%'
        }
        if (width >= 768 && width <= 850) {
            return '-9%'
        }
        if (width >= 850 && width <= 950) {
            return '-13%'
        }
        if (width >= 950 && width <= 1024) {
            return '-15%'
        }
        if (width >= 1024 && width <= 1200) {
            return '-20%'
        }
        if (width >= 1200 && width <= 1300) {
            return '-22%'
        }
        if (width >= 1300 && width <= 1400) {
            return '-25%'
        }

        return '-30%'
    }

    if (isSliding.value) {
        return `${calculatedPercentage.value}%`
    }

    return '0%'
})

onMounted(() => {
    updateBreakpoint()
    window.addEventListener('resize', updateBreakpoint)
    setTimeout(() => {
        isIntroSliding.value = true
    }, 12000)

    setTimeout(() => {
        step.value = 2
        isIntroSliding.value = false

        setTimeout(() => {
            isSliding.value = true

            setTimeout(() => {
                step.value = 3
            }, 2100)
        }, 800)
    }, 15000)
})
onUnmounted(() => {
    window.removeEventListener('resize', updateBreakpoint)
})
</script>

<template>
    <div>
        <Transition name="fade" mode="out-in">
            <div v-if="step === 1" key="intro" :class="styles.introContainer">
                <div :class="styles.fixedIntroWaves"></div>
                <div
                    :class="styles.introMovable"
                    :style="{ left: dynamicLeftPosition, transition: isIntroSliding ? 'left 3s linear' : 'none' }"
                >
                    <DotLottieVue :data="scene1_3" autoplay :class="styles.scene1Style" />
                </div>
            </div>

            <div v-else key="content" :class="styles.sliderWrapper">
                <div class="sliderTrack" :style="{ '--mask': dynamicMask }">
                    <div :class="styles.movableContainer" :style="{ left: dynamicLeftPosition }">
                        <DotLottieVue
                            :class="styles.scene3Style"
                            :render-settings="{
                                viewBoxSize: '800 650',
                                preserveAspectRatio: 'xMidYMid meet',
                                progressiveLoad: false,
                                hideOnTransparent: true,
                            }"
                            v-if="step === 2"
                            :data="scene2Moving"
                            autoplay
                            loop
                            :speed="0.5"
                        />
                        <DotLottieVue
                            v-if="step === 3"
                            :data="scene3"
                            autoplay
                            :loop="false"
                            :class="styles.scene3Style"
                            :render-settings="{
                                viewBoxSize: '800 650',
                                preserveAspectRatio: 'xMidYMid meet',
                                progressiveLoad: false,
                                hideOnTransparent: true,
                            }"
                        />
                    </div>
                    <div :class="styles.triangleBottom" :style="{ left: dynamicLeftPosition }"></div>
                </div>
                <div :class="styles.scaleLabels" class="labels">
                    <span :class="styles.label" :style="{ left: (props.areas?.[0] ?? 33) / 2 + '%' }">
                        {{ isMobile ? t('areas.mobileFirst') : t('areas.first') }}
                    </span>

                    <span :class="styles.label" :style="{ left: ((props.areas?.[0] ?? 33) + (props.areas?.[1] ?? 66)) / 2 + '%' }">
                        {{ isMobile ? t('areas.mobileMiddle') : t('areas.middle') }}
                    </span>

                    <span :class="styles.label" :style="{ left: ((props.areas?.[1] ?? 66) + 100) / 2 + '%' }">
                        {{ isMobile ? t('areas.mobileLast') : t('areas.last') }}
                    </span>
                </div>
            </div>
        </Transition>
    </div>
</template>

<style scoped>
.sliderTrack {
    height: 300px;
    width: 100%;
    position: relative;
    overflow: hidden;
}

/* .sliderTrack::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: url('@/themes/icons/dark_waves.svg');
    background-repeat: repeat-x;
    background-position: 0% 75%;
    background-size: auto 250px;
    -webkit-mask-image: var(--mask);
    mask-image: var(--mask);
    z-index: 1;
} */
/* .sliderTrack::before {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0; 
    width: 100%;
    height: 250px; 
    background-image: url('@/themes/icons/dark_waves.svg');
    background-repeat: repeat-x;
    background-position: bottom; 
    background-size: auto 250px;
    -webkit-mask-image: var(--mask);
    mask-image: var(--mask);
    z-index: 1;
} */

.sliderTrack::before {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 250px;
    background-image: url('@/themes/icons/dark_waves.svg');
    background-repeat: repeat-x;
    background-position: bottom left;
    background-size: auto 250px;
    z-index: 1;

    animation: slideOutToLeft 5.5s cubic-bezier(0.25, 1, 0.5, 1) 0.5s forwards;
}

.sliderTrack::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 250px;
    background-image: url('@/themes/icons/dark_waves.svg');
    background-repeat: repeat-x;
    background-position: bottom left;
    background-size: auto 250px;

    -webkit-mask-image: var(--mask);
    mask-image: var(--mask);
    z-index: 2;

    transform: translateX(100%);

    animation: slideInFromRight 5.5s cubic-bezier(0.25, 1, 0.5, 1) 0.5s forwards;
}

.labels {
    animation: slideInFromRight 5.5s cubic-bezier(0.25, 1, 0.5, 1) 0.5s forwards;
}

@keyframes slideOutToLeft {
    to {
        transform: translateX(-100%);
    }
}

@keyframes slideInFromRight {
    from {
        transform: translateX(100%);
    }
    to {
        transform: translateX(0%);
    }
}

@keyframes fadeOut {
    to {
        opacity: 0;
    }
}

@media (max-width: 768px) {
    .sliderTrack {
        height: 250px;
    }
}
</style>
