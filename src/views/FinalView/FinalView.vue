<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import styles from './styles.module.css'
import { ref } from 'vue'
import competenceTexts from '@/assets/competence_guidingideas_texts.json'
const { t } = useI18n()

const openEnvelopeIndex = ref<number | null>(null)

const toggleEnvelope = (index: number) => {
    if (openEnvelopeIndex.value === index) {
        openEnvelopeIndex.value = null
    } else {
        openEnvelopeIndex.value = index
    }
}
const links = competenceTexts.exerciseLinks || []
</script>


<template>
    <div :class="styles.page">
        <h1>{{ t('finalView.title') }}</h1>
        <p :id="styles.viewDescription">{{ t('finalView.text') }}</p>

        <ul :class="styles.quadratContainer" role="list">
            <li
                v-for="(letter, index) in 3"
                :key="index"
                :class="styles.envelopeItem"
            >
                <button
                    type="button"
                    :class="[styles.envelopeForm, openEnvelopeIndex === index ? styles.isOpen : '']"
                    :aria-expanded="openEnvelopeIndex === index"
                    :aria-label="`Brief ${index + 1} ${openEnvelopeIndex === index ? 'schließen' : 'öffnen'}`"
                    @click="toggleEnvelope(index)"
                >
                    <div :class="styles.envWrap">
                        <div 
                            :class="styles.envFormWrap"
                            :aria-hidden="openEnvelopeIndex !== index"
                        >
                            <h2 :class="styles.letterTitle">Aufgabe {{ index + 1 }}</h2>                          
                            <div :class="styles.linkContainer">
                                <a                                
                                    v-if="links[index]"
                                    :href="links[index]"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    :class="styles.letterLink"
                                    :tabindex="openEnvelopeIndex === index ? 0 : -1"
                                    @click.stop
                                >
                                    Zur Übung {{ index + 1 }}
                                    <span :class="styles.visuallyHidden">
                                        (öffnet in neuem Fenster)
                                    </span>
                                </a>
                            </div>
                        </div>

                        <div :class="styles.envTop" aria-hidden="true"></div>
                        <div :class="styles.envBottomWrap" aria-hidden="true">
                            <div :class="styles.envBottom"></div>
                        </div>
                    </div>
                </button>
            </li>
        </ul>
    </div>
</template>