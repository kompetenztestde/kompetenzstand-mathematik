<script setup lang="ts">
import { useGuidingIdeas } from '@/composables/useGuidingIdeas'
import styles from './styles.module.css'
import layout from '@/assets/styles/component-layout.module.css'
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import SingleBarChart from '../SingleBarChart/SingleBarChart.vue'
import '@/assets/styles/base.css'
import { useModalStore } from '@/stores/modalStore'
import { useGuidingIdeasNew } from '@/composables/useGuidingIdeasNew'
import RaumUndForm from './icons/raum_und_form.png'
import GroessenUndMessen from './icons/groessen_messen.png'
import Strukturen from './icons/strukturen.png'
import ZahlUndOperationen from './icons/zahl_und_operationen.png'
import { useI18n } from 'vue-i18n'

const modalStore = useModalStore()

const route = useRoute()
const activeSubStep = computed(() => {
    const sId = route.params.subId
    return sId !== undefined ? Number(sId) : 0
})
const currentUserName = computed(() => route.query.user as string)
const currentUserCode = computed(() => route.query.user as string)

// const { topPerformers } = useGuidingIdeas(currentUserName)
const { topPerformers, calculatedAreas } = useGuidingIdeasNew(currentUserCode)

const currentItem = computed(() => topPerformers.value[activeSubStep.value])
const { t } = useI18n()

const showDetails = () => {
    if (currentItem.value) {
        modalStore.openModal(currentItem.value.label, currentItem.value.description)
    }
}

watch(topPerformers, (newVal) => {
    if (newVal) {
        console.log('Die Tops sind da:', newVal)
    }
})

const imageMap: Record<string, string> = {
    'Raum und Form': RaumUndForm,
    'Größen und Messen': GroessenUndMessen,
    'Strukturen und funktionaler Zusammenhang': Strukturen,
    'Zahl und Operation': ZahlUndOperationen
}

const currentIllustration = computed(() => {
    if (!currentItem.value) return null
    return imageMap[currentItem.value.label] || null
})
</script>

<template>
    <div v-if="currentItem" :class="styles.statPaginator">
        <div :class="layout.baseCard">
            <div :class="[layout.baseIllustration, styles.illustrationHeader]">
                <div class="title-row">
                    <h1>{{ currentItem.label }}</h1>
                    <img @click="showDetails" :class="styles.info" src="@/themes/icons/info.svg" />
                </div>
                <!-- <img @click="showDetails" :class="styles.info" src="./icons/strukturen.png"/> -->
                <img v-if="currentIllustration" :class="styles.icon" :src="currentIllustration" alt="Illustration" />
            </div>
            <div :class="layout.baseContentArea">
                <h2>{{ t('common.result') }}</h2>
                <SingleBarChart :areas="calculatedAreas" :percentage="currentItem.percentage" />
                <span class="text-body">
                    {{ currentItem.text }}
                </span>
            </div>
        </div>
    </div>
</template>
