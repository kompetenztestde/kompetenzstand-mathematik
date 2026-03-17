<!-- <script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { LEVEL_MAP, type LevelLabel } from '@/types'
import styles from './styles.module.css'
import { DotLottieVue } from '@lottiefiles/dotlottie-vue'

const props = defineProps<{
    level: LevelLabel
}>()

const isDropped = ref(false)
const isSliding = ref(false)

const currentScore = computed(() => {
    return LEVEL_MAP[props.level] || 1
})

const markerStyle = computed(() => {
    const positionPercent = isSliding.value ? currentScore.value * 20 - 10 : 10

    return {
        left: `${positionPercent}%`,
    }
})

onMounted(() => {
    setTimeout(() => {
        isDropped.value = true
    }, 100)

    setTimeout(() => {
        isSliding.value = true
    }, 1600)
})
</script>
<template>
    <div :class="styles.pageContainer">
        <div :class="styles.sliderWrapper">
            <div :class="styles.sliderTrack">
                <div :class="[styles.sliderMarker, isDropped ? styles.isDropped : '']" :style="markerStyle">
                    <span>{{ isSliding ? currentScore : '' }}</span>
                </div>
                <div :class="styles.trackSegments">
                    <div :class="[styles.segment, styles.s1]"></div>
                    <div :class="[styles.segment, styles.s2]"></div>
                    <div :class="[styles.segment, styles.s3]"></div>
                    <div :class="[styles.segment, styles.s4]"></div>
                    <div :class="[styles.segment, styles.s5]"></div>
                </div>
            </div>
            <div :class="styles.scaleLabels">
                <span>Unterer Mindestbereich</span>
                <span>Erwartungsbereich</span>
                <span>Optimalbereich</span>
            </div>
        </div>
    </div>
    <div class="animation-container">
        <DotLottieVue
            style="height: 300px; width: 300px"
            loop
            :speed="0.3"
            :segment="[30, 150]"
            src="/animation1.lottie"
            autocomplete
            autoplay
        />
    </div>
    <div class="crop-container">
        <DotLottieVue src="/animation1.lottie"
         class="my-lottie" 
         :segment="[42, 150]"
         :speed="0.3" 
         autoplay loop />
    </div>
</template>

<style scoped>
.animation-container {
    display: flex;
    justify-content: center;
    align-items: center;
}
.crop-container {
    width: 400px;
    height: 400px;
    overflow: hidden;
    position: relative;
}

.my-lottie {
    height: 100% !important;
    width: auto !important;
    position: absolute;
    right: 0;
    transform: translateX(-100px);
}
</style> -->
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { DotLottieVue } from '@lottiefiles/dotlottie-vue'
import { type LevelLabel, LEVEL_MAP } from '@/types'
import styles from './styles.module.css'

const props = defineProps<{
    level: LevelLabel
}>()

const step = ref(1)
const isSliding = ref(false)

const currentScore = computed(() => LEVEL_MAP[props.level] || 1)

const dynamicLeftPosition = computed(() => {
    return isSliding.value ? `${currentScore.value * 20 - 10}%` : '10%'
})

onMounted(() => {
    setTimeout(() => {
        step.value = 2

        setTimeout(() => {
            isSliding.value = true

            setTimeout(() => {
                step.value = 3
            }, 2100)
        }, 800)
    }, 3000)
})
</script>

<template>
    <div :class="styles.mainWrapper">
        <Transition name="fade" mode="out-in">
            <div v-if="step === 1" key="intro" :class="styles.stage">
                <DotLottieVue src="/animation1.lottie" autoplay :speed="0.5" :class="styles.fullSize" />
            </div>

            <div v-else key="content" :class="styles.pageContainer">
                <div :class="styles.sliderWrapper">
                    <div :class="styles.sliderTrack">
                        <div :class="styles.movableContainer" :style="{ left: dynamicLeftPosition }">
                            <DotLottieVue v-if="step === 2" src="/swimming.lottie" autoplay loop :speed="0.5" :class="styles.fullSize" />
                            <DotLottieVue v-if="step === 3" src="/appear.lottie" autoplay :loop="false" :class="styles.fullSize" />
                            <!-- <span v-if="isSliding" :class="styles.scoreLabel">Score: {{ currentScore }}</span> -->
                        </div>

                        <div :class="styles.trackSegments">
                            <div :class="[styles.segment, styles.s1]"></div>
                            <div :class="[styles.segment, styles.s2]"></div>
                            <div :class="[styles.segment, styles.s3]"></div>
                            <div :class="[styles.segment, styles.s4]"></div>
                            <div :class="[styles.segment, styles.s5]"></div>
                        </div>
                    </div>

                    <div :class="styles.scaleLabels">
                        <span>Unterer Mindestbereich</span>
                        <span>Erwartungsbereich</span>
                        <span>Optimalbereich</span>
                    </div>
                </div>
            </div>
        </Transition>
    </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.6s ease;
}
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
