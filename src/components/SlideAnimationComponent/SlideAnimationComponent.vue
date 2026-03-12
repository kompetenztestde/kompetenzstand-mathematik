<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { LEVEL_MAP, type LevelLabel } from '@/types'
import styles from './styles.module.css'

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
</template>
