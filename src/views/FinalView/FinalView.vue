<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import styles from './styles.module.css'
import { ref } from 'vue'
import { configJson } from '@/services/configService'
import MorphIcon1 from './icons/teaser_1.svg?component'
import MorphIcon2 from './icons/teaser_2.svg?component'
import MorphIcon3 from './icons/teaser_3.svg?component'
import MorphCard from '../../components/MorphCard/MorphCard.vue'
const { t } = useI18n()
const competenceTexts = configJson
const openEnvelopeIndex = ref<number | null>(null)

const toggleEnvelope = (index: number) => {
    if (openEnvelopeIndex.value === index) {
        openEnvelopeIndex.value = null
    } else {
        openEnvelopeIndex.value = index
    }
}
const links = competenceTexts.exerciseLinks || []
const morphIconList = [MorphIcon1, MorphIcon2, MorphIcon3]

const handleCardClick = (index: number) => {
    const targetUrl = links[index]
    if (targetUrl) {
        window.open(targetUrl, '_blank', 'noopener,noreferrer')
    }
}
</script>

<template>
    <div :class="styles.page">
        <h1>{{ t('finalView.title') }}</h1>
        <span class="text-body-big" :class="styles.viewDescription">{{ t('finalView.text') }}</span>

        <ul :class="styles.quadratContainer" role="list">
            <li v-for="(letter, index) in 3" :key="index" :class="styles.envelopeItem">
                <button
                    type="button"
                    :class="[styles.envelopeForm, openEnvelopeIndex === index ? styles.isOpen : '']"
                    :aria-expanded="openEnvelopeIndex === index"
                    :aria-label="`Brief ${index + 1} ${openEnvelopeIndex === index ? 'schließen' : 'öffnen'}`"
                    @click="handleCardClick(index)"
                >
                    <MorphCard :icon="morphIconList[index]" />
                    <h2 :class="styles.letterTitle">Aufgabe {{ index + 1 }}</h2>
                </button>
            </li>
        </ul>
    </div>
</template>
