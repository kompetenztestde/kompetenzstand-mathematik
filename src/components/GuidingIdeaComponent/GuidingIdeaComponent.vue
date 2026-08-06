<script setup lang="ts">
import styles from './styles.module.css'
import layout from '@/assets/styles/component-layout.module.css'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import SingleBarChart from '../SingleBarChart/SingleBarChart.vue'
import '@/assets/styles/base.css'
import { useModalStore } from '@/stores/modalStore'
import RaumUndForm from './icons/raum_und_form.png'
import GroessenUndMessen from './icons/groessen_messen.png'
import Strukturen from './icons/strukturen.png'
import ZahlUndOperationen from './icons/zahl_und_operationen.png'
import DatenUndZufall from './icons/Daten_und_Zufall.png'
import { useI18n } from 'vue-i18n'
import InfoIcon from '@/themes/icons/info.svg?component'
import Celebrate from './icons/celebrate.png'
import Contemplative from './icons/contemplative.png'
import Neutral from './icons/neutral.png'
import { IconStatus } from '@/types.ts'

interface Performer {
    label: string
    description: string
    percentage: number
    text: string
    areas: any
    type?: IconStatus
}

interface SizeConfig {
    width: string
    height: string
    aspectRatio: string
}

interface ImageConfig {
    src: string
    mobile: SizeConfig
    desktop: SizeConfig
}

const props = defineProps<{
    data: Performer[]
    type?: IconStatus | 'positive' | 'negative' | 'neutral'
}>()

const statusIcon = computed(() => {
    const currentType = currentItem.value?.type ?? props.type
    if (currentType === IconStatus.Negative) return Contemplative
    if (currentType === IconStatus.Neutral) return Neutral
    return Celebrate
})
const modalStore = useModalStore()
const route = useRoute()

const activeSubStep = computed(() => {
    const sId = route.params.subId
    return sId !== undefined ? Number(sId) : 0
})

const currentItem = computed(() => {
    if (!props.data || props.data.length === 0) return null
    const index = Math.min(activeSubStep.value, props.data.length - 1)
    return props.data[index]
})
const { t } = useI18n()

const showDetails = () => {
    if (currentItem.value) {
        modalStore.openModal(currentItem.value.label, currentItem.value.description)
    }
}

const imageMap: Record<string, ImageConfig> = {
    'Raum und Form': {
        src: RaumUndForm,
        mobile: {
            width: '247px',
            height: '206px',
            aspectRatio: '241/201',
        },
        desktop: {
            width: '348px',
            height: '289px',
            aspectRatio: '59/49',
        },
    },
    'Größen und Messen': {
        src: GroessenUndMessen,
        mobile: {
            width: '276px',
            height: '200px',
            aspectRatio: '69/50',
        },
        desktop: {
            width: '350px',
            height: '253px',
            aspectRatio: '83/60',
        },
    },
    'Strukturen und funktionaler Zusammenhang': {
        src: Strukturen,
        mobile: {
            width: '219px',
            height: '158px',
            aspectRatio: '140/101',
        },
        desktop: {
            width: '350px',
            height: '253px',
            aspectRatio: '83/60',
        },
    },
    'Zahl und Operation': {
        src: ZahlUndOperationen,
        mobile: {
            width: '280px',
            height: '280px',
            aspectRatio: '1/1',
        },
        desktop: {
            width: '280px',
            height: '280px',
            aspectRatio: '1/1',
        },
    },
    'Daten und Zufall': {
        src: DatenUndZufall,
        mobile: {
            width: '320px',
            height: '240px',
            aspectRatio: '4/3',
        },
        desktop: {
            width: '320px',
            height: '240px',
            aspectRatio: '4/3',
        },
    },
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
                <div @click="showDetails" :class="styles.titleRow">
                        <h1>{{ currentItem.label }}</h1>
                    <button
                        type="button"
                        :class="styles.infoButton"
                        :aria-label="t('competence.show_details_label')"
                        title="Details anzeigen"
                    >
                        <InfoIcon :class="styles.infoIcon" aria-hidden="true" />
                    </button>
                </div>

                <img
                    v-if="currentIllustration"
                    :src="currentIllustration.src"
                    :style="{
                        '--w-mob': currentIllustration.mobile.width,
                        '--h-mob': currentIllustration.mobile.height,
                        '--ar-mob': currentIllustration.mobile.aspectRatio,
                        '--w-desk': currentIllustration.desktop.width,
                        '--h-desk': currentIllustration.desktop.height,
                        '--ar-desk': currentIllustration.desktop.aspectRatio,
                    }"
                    :class="styles.icon"
                    alt="Illustration"
                />
            </div>
            <div :class="layout.baseContentArea">
                <div :class="styles.result">
                    <h2>{{ t('common.result') }}</h2>
                    <img :class="styles.celebrate" :src="statusIcon" alt="Status Icon" />
                </div>

                <SingleBarChart :areas="currentItem.areas" :percentage="currentItem.percentage" />

                <span class="text-body-big" :class="styles.descriptionText">
                    {{ currentItem.text }}
                </span>
            </div>
        </div>
    </div>
</template>
