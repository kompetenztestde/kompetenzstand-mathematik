<script setup lang="ts">
import { useGuidingIdeas } from '@/composables/useGuidingIdeas'
const id = '8b-mathe'
const types = 'students'
const { badPerformers } = useGuidingIdeas(id, types)
import BarCharts from '@/components/BarCharts/BarCharts.vue'
</script>
<template>
    <div class="page">
        <h1>In den folgenden Bereichen warst du nicht so gut</h1>
        <span>Schrittweises Üben wird dir helfen, sicherer zu werden.</span>
        <BarCharts :badPerformers="badPerformers" />
    </div>
</template>

<style scoped>
.page {
    padding: 40px 20px;
    text-align: center;
    min-height: 100vh;
}
</style>
