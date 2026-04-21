<script setup lang="ts">
import '@/assets/styles/variables.css'
import { useI18n } from 'vue-i18n'
import BarCharts from '@/components/BarCharts/BarCharts.vue'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useGuidingIdeasNew } from '@/composables/useGuidingIdeasNew'
import { useModalStore } from '@/stores/modalStore'
import infoIcon from '@/themes/icons/info.svg'
import SingleBarCharts from '@/components/SingleBarChart/SingleBarChart.vue'
import styles from './styles.module.css'
const route = useRoute()
const currentUserCode = computed(() => route.query.user as string)

const { t } = useI18n()
const { badPerformers, calculatedAreas } = useGuidingIdeasNew(currentUserCode)

const isMobile = ref(false)
const checkMobile = () => {
    isMobile.value = window.innerWidth < 768
}

const modalStore = useModalStore()
onMounted(() => {
    checkMobile()
    window.addEventListener('resize', checkMobile)
})
onUnmounted(() => {
    window.removeEventListener('resize', checkMobile)
})

const openInfo = (item: any) => {
    modalStore.openModal(item.label, item.description || item.text)
}
</script>
<template>
    <div :class="styles.page">
        <h1>{{ t('badResults.title') }}</h1>
        <span>{{ t('badResults.text') }}</span>
        <BarCharts v-if="!isMobile" :badPerformers="badPerformers" :areas="calculatedAreas" />
        <div v-else :class="styles.mobileList">
            <div v-for="item in badPerformers" :key="item.label" :class="styles.mobileCard">
                <div :class="styles.mobileCardHeader" @click="openInfo(item)">
                    <h3>{{ item.label }}</h3>
                    <img :src="infoIcon" :class="styles.infoTrigger" alt="info" />
                </div>
                <SingleBarCharts :percentage="item.percentage" :areas="calculatedAreas" />
            </div>
        </div>
    </div>
</template>
