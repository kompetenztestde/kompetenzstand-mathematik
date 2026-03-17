<script setup lang="ts">
import { useGuidingIdeas } from '@/composables/useGuidingIdeas'
import styles from './styles.module.css'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import SingleBarChart from '../SingleBarChart/SingleBarChart.vue'

const route = useRoute()
const activeSubStep = computed(() => {
    const sId = route.params.subId
    return sId !== undefined ? Number(sId) : 0
})
const { topPerformers } = useGuidingIdeas('8b-mathe', 'students')

const currentItem = computed(() => topPerformers.value[activeSubStep.value])
</script>

<template>
    <div v-if="currentItem" :class="styles.statPaginator">
        <div :class="styles.card">
            <h3>{{ currentItem.label }}</h3>
            <SingleBarChart :percentage="currentItem.percentage" />
            <span :class="styles.text">{{ currentItem.text }}</span>
        </div>
    </div>
</template>
