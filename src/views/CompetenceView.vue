<script setup lang="ts">
import { useCompetences } from '@/composables/useCompetences'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
const id = '8b-mathe'
const types = 'students'
const route = useRoute()
const { topPerformers } = useCompetences(id, types)
const activeSubStep = computed(() => parseInt(route.params.subId as string) || 0)
const currentItem = computed(() => topPerformers.value[activeSubStep.value])
</script>

<template>
    <div class="page">
        <h1>Kompetenzstärke</h1>
        <div class="container"></div>
        <div></div>
        <div>In den folgenden Kompetenzen hast du sehr gute Ergebnisse geliefert</div>
        <div v-if="currentItem">
            <div >
                <h3>{{ currentItem.label }}</h3>
            </div>
        </div>
    </div>
</template>

<style scoped>
.page {
    padding: 20px;
    text-align: center;
}

.container {
    width: 50%;
    padding: 16px;
    margin: auto;
}
</style>
