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

// const currentScore = computed(() => LEVEL_MAP[props.level] || 1)
const currentScore = computed(() => {
    if (!props.level) {
        return 1
    }
    return LEVEL_MAP[props.level]
})

watch(props, (newVal) => {
    if (newVal) {
        console.log('Value:', props.level)
    }
})

const isIntroSliding = ref(false)

// const dynamicLeftPosition = computed(() => {
//     if (step.value === 1 && isIntroSliding.value) {
//         return '120%'
//     }

//     if (isSliding.value) {
//         return `${currentScore.value * 20 - 10}%`
//         // const offset = isMobile.value ? 5 : 10;
//         // return `${currentScore.value * 20 - offset}%`;
//     }

//     //return '-32%';
//     // return isMobile.value ? '-15%' : '-32%';
//     return isMobile.value ? '0%' : '-10%'
// })


const dynamicLeftPosition = computed(() => {
    const width = window.innerWidth
    if (step.value === 1) {
        if (isIntroSliding.value) {
            return '120%'; 
        }
        if (width < 768) {
            return '0%'
        }
        if (width >= 768 && width <= 1024) {
            return '-7%'
        }
        //return isMobile.value ? '0%' : '-7%'; 
        return '-30%'
    }

    if (isSliding.value) {
        return `${currentScore.value * 20 - 10}%`;
    }

    return '0%';
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
            <!-- <div v-if="step === 1" key="intro" :class="styles.introContainer">
                <div :class="styles.fixedIntroWaves"></div>

                <div
                    :class="styles.introMovable"
                    :style="{ left: dynamicLeftPosition, transition: isIntroSliding ? 'left 3s linear' : 'none' }"
                >
                    <DotLottieVue :data="scene1_3" autoplay :class="styles.scene1Style" />
                </div>
            </div> -->

            <div v-if="step === 1" key="intro" :class="styles.introContainer">
                <div :class="styles.introStage">
                    <div :class="styles.fixedIntroWaves"></div>

                    <div
                    :class="styles.introMovable"
                    :style="{ left: dynamicLeftPosition, transition: isIntroSliding ? 'left 3s linear' : 'none' }"
                >
                    <!-- <div :class="[styles.introMovable, isIntroSliding ? styles.isSliding : styles.isWaiting]"> -->
                        <DotLottieVue :data="scene1_3" autoplay :class="styles.scene1Style" />
                    </div>
                </div>
            </div>

            <div v-else key="content" :class="styles.pageContainer">
                <div :class="styles.sliderWrapper">
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
                    </div>
                    <div :class="styles.scaleLabels">
                        <span :style="{ left: (areas?.[0] ?? 33) / 2 + '%' }">
                            {{ t('areas.first') }}
                        </span>

                        <span :style="{ left: ((areas?.[0] ?? 33) + (areas?.[1] ?? 66)) / 2 + '%' }">
                            {{ t('areas.middle') }}
                        </span>

                        <span :style="{ left: ((areas?.[1] ?? 66) + 100) / 2 + '%' }">
                            {{ t('areas.last') }}
                        </span>
                    </div>
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
    background-color: transparent;
}

.sliderTrack::before {
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
}
</style>
