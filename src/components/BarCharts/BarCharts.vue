<script setup lang="ts">
import { ref } from 'vue';
import styles from './styles.module.css'
interface Performer {
  label: string;
  text: string;
  description: string;
  hits: number;
  total: number;
  percentage: number;
}
const props = defineProps<{
 badPerformers: Performer[];
}>();

const activeDescription = ref<string | null>(null)
    const showInfo = (desc: string | undefined) => {
  activeDescription.value = desc || 'Keine Beschreibung verfügbar.'
}

const closeInfo = () => {
  activeDescription.value = null
}
const getBarClass = (percentage: number) => {
    if (percentage < 33) return styles.barLow
    if (percentage < 66) return styles.barMid
    return styles.barHigh
}
</script>
<template>
    <div :class="styles.page">
        <div :class="styles.chartContainer">
            <div v-for="item in badPerformers" :key="item.label" :class="styles.chartRow">
                <div :class="styles.labelArea">
                    <button 
                        @click="showInfo(item.description)" 
                        :class="styles.infoBtn"
                        title="Mehr Informationen"
                    >
                        i
                    </button>
                    <span :class="styles.labelText">{{ item.label }}</span>
                </div>

                <div :class="styles.barTrack">
                    <div :class="[styles.bar, getBarClass(item.percentage)]" :style="{ width: `${item.percentage}%` }">
                        <span :class="styles.valueBadge">{{ item.percentage }}%</span>
                    </div>
                </div>
            </div>

            <div :class="styles.xAxisLabels">
                <div :class="styles.axisSpace"></div>
                <div :class="styles.axisTicks">
                    <span>Unterer Bereich</span>
                    <span>Erwartungsbereich</span>
                    <span>Optimalbereich</span>
                </div>
            </div>
        </div>

        <div v-if="activeDescription" :class="styles.modalOverlay" @click="closeInfo">
            <div :class="styles.modalContent" @click.stop>
                <h3>Details</h3>
                <p>{{ activeDescription }}</p>
                <button @click="closeInfo" :class="styles.closeBtn">Schließen</button>
            </div>
        </div>
    </div>
</template>
