<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { DotLottieVue } from '@lottiefiles/dotlottie-vue'
import { type LevelLabel, LEVEL_MAP } from '@/types'
import styles from './styles.module.css'
import { useI18n } from 'vue-i18n'
import scene1Data from '@/assets/animations/scene1.json'
const { t } = useI18n()

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
                setTimeout(() =>{
                    step.value = 4
                },2000);
            }, 2100)
        }, 800)
    }, 11000)
})
</script>

<template>
    <div :class="styles.mainWrapper">
        <!-- <Transition name="fade" mode="out-in">
            <div v-if="step === 1" key="intro" :class="styles.stage">
                <DotLottieVue :data="scene1Data" autoplay :class="styles.fullSize" />
            </div>

            <div v-else key="content" :class="styles.pageContainer">
                <div :class="styles.sliderWrapper">
                    <div :class="styles.sliderTrack">
                        <div :class="styles.movableContainer" :style="{ left: dynamicLeftPosition }">
                            <DotLottieVue v-if="step === 2" src="/swimming.lottie" autoplay loop :speed="0.5" :class="styles.fullSize" />
                            <DotLottieVue v-if="step === 3" src="/appear.lottie" autoplay :loop="false" :class="styles.fullSize" />
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
                        <span>{{ t('areas.first') }}</span>
                        <span>{{ t('areas.middle') }}</span>
                        <span>{{ t('areas.last') }}</span>
                    </div>
                </div>
            </div>
        </Transition> -->
        <Transition name="fade" mode="out-in">
            <div v-if="step === 1" key="intro">
                <DotLottieVue :data="scene1Data" autoplay :class="styles.fullSize" />
            </div>
            <div v-else key="content" :class="styles.pageContainer">
                <div :class="styles.sliderWrapper">
                    <div :class="styles.sliderTrack">
                        <div :class="styles.movableContainer" :style="{ left: dynamicLeftPosition }">
                            <DotLottieVue v-if="step === 2" src="/swimming.lottie" autoplay loop :speed="0.5" />
                            <DotLottieVue v-if="step === 3" src="/appear.lottie" autoplay :loop="false" />
                            <img v-if="step === 4" src="@/assets/animations/CharacterC1.png" :class="styles.charIcon" alt="" />
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
                        <span>{{ t('areas.first') }}</span>
                        <span>{{ t('areas.middle') }}</span>
                        <span>{{ t('areas.last') }}</span>
                    </div>
                </div>
            </div>
        </Transition>
    </div>
</template>
