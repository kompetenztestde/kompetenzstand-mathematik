<script setup lang="ts">
import '@/assets/styles/variables.css'
import { useI18n } from 'vue-i18n'
import BarCharts from '@/components/BarCharts/BarCharts.vue'
import GuidingIdeaComponent from '@/components/GuidingIdeaComponent/GuidingIdeaComponent.vue'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useGuidingIdeasNew } from '@/composables/useGuidingIdeasNew'
import { useModalStore } from '@/stores/modalStore'
import InfoIcon from '@/themes/icons/info.svg?component'
import SingleBarCharts from '@/components/SingleBarChart/SingleBarChart.vue'
import styles from './styles.module.css'
import Contemplative from './icons/contemplative.png'
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

const isMultiBad = computed(() => {
    return badPerformers.value.length > 2
})
</script>
<template>
    <!-- <div> -->
    <div :class="styles.page" v-if="!isMultiBad">
        <GuidingIdeaComponent :data="badPerformers" type="negative" />
    </div>
    <div :class="styles.page" v-else>
        <div :class="styles.headerWrapper">
            <h1>{{ t('badResults.title') }}</h1>
            <img :class="styles.contemplative" :src="Contemplative" alt="Contemptive Icon" />
        </div>
        <span class="text-body-big" :class="styles.introText">
            {{ t('badResults.text') }}
        </span>
        <BarCharts v-if="!isMobile" :badPerformers="badPerformers" :areas="calculatedAreas" />
        <div v-else :class="styles.mobileList">
            <div v-for="item in badPerformers" :key="item.label" :class="styles.mobileCard">
                <div :class="styles.mobileCardHeader" @click="openInfo(item)">
                    <span class="text-label-bold">{{ item.label }}</span>
                    <InfoIcon aria-hidden="true" />
                </div>
                <SingleBarCharts :percentage="item.percentage" :areas="item.areas" />
            </div>

            <div :class="styles.scaleLabelsRow">
                <span
                    :class="styles.scaleLabel"
                    :style="
                        isMobile ? { right: 100 - (calculatedAreas[0] ?? 33) / 2 + '%' } : { left: (calculatedAreas[0] ?? 33) / 2 + '%' }
                    "
                >
                    {{ t('areas.first') }}
                </span>

                <span
                    :class="styles.scaleLabel"
                    :style="
                        isMobile
                            ? { right: 100 - ((calculatedAreas[0] ?? 33) + (calculatedAreas[1] ?? 66)) / 2 + '%' }
                            : { left: ((calculatedAreas[0] ?? 33) + (calculatedAreas[1] ?? 66)) / 2 + '%' }
                    "
                >
                    {{ t('areas.middle') }}
                </span>

                <span
                    :class="styles.scaleLabel"
                    :style="
                        isMobile
                            ? { right: ((calculatedAreas[2] ?? 100) - (calculatedAreas[1] ?? 66)) / 2 + '%' }
                            : { left: ((calculatedAreas[1] ?? 66) + 100) / 2 + '%' }
                    "
                >
                    {{ t('areas.last') }}
                </span>
            </div>
        </div>
    </div>
    <!-- </div> -->
</template>

<style scoped>
.page {
    text-align: center;
    background-color: white;
    grid-column: 1 / -1;
    display: grid;
    grid-template-columns: subgrid;
    border-radius: 20px;
}
</style>
