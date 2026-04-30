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
import DatenUndZufall from './icons/Daten_und_Zufall.png'
import { useI18n } from 'vue-i18n'
import InfoIcon from '@/themes/icons/info.svg?component'
import Celebrate from './icons/celebrate.png'

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
                    <!-- <img @click="showDetails" :class="styles.info" src="@/themes/icons/info.svg" /> -->
                    <button
                        type="button"
                        :class="styles.infoButton"
                        :aria-label="t('competence.show_details_label')"
                        title="Details anzeigen"
                    >
                        <!-- <img src="@/themes/icons/info.svg" :class="styles.infoIcon" alt="" aria-hidden="true" /> -->
                        <InfoIcon :class="styles.infoIcon" aria-hidden="true" />
                    </button>
                </div>
                <!-- <img @click="showDetails" :class="styles.info" src="./icons/strukturen.png"/> -->
                <!-- <img v-if="currentIllustration" :class="styles.icon" :src="currentIllustration" alt="Illustration" /> -->
                 <img 
    v-if="currentIllustration" 
    :src="currentIllustration.src" 
    :style="{
        '--w-mob': currentIllustration.mobile.width,
        '--h-mob': currentIllustration.mobile.height,
        '--ar-mob': currentIllustration.mobile.aspectRatio,
        '--w-desk': currentIllustration.desktop.width,
        '--h-desk': currentIllustration.desktop.height,
        '--ar-desk': currentIllustration.desktop.aspectRatio
    }"
    :class="styles.icon" 
    alt="Illustration" 
/>
                <!-- <InfoIcon v-if="currentIllustration" :class="styles.infoIcon" aria-hidden="true" /> -->
            </div>
            <div :class="layout.baseContentArea">
                <div :class="styles.result">
                    <h2>{{ t('common.result') }}</h2>
                    <img :class="styles.celebrate" :src="Celebrate" alt="Contemptive Icon" />
                </div>

                <!--<SingleBarChart :areas="calculatedAreas" :percentage="currentItem.percentage" />-->
                <SingleBarChart :areas="currentItem.areas" :percentage="currentItem.percentage" />

                <span class="text-body">
                    {{ currentItem.text }}
                </span>
            </div>
        </div>
    </div>
</template>
