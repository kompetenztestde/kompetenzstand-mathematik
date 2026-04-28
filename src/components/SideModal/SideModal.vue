<script setup lang="ts">
import { useModalStore } from '@/stores/modalStore'
import { nextTick } from 'vue'
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import Speaker from './icons/speaker.svg?component'
const { t } = useI18n()
const modalStore = useModalStore()

const closeBtnRef = ref<HTMLButtonElement | null>(null)
let lastFocusedElement: HTMLElement | null = null
// const speak = () => {
//     if ('speechSynthesis' in window) {
//         window.speechSynthesis.cancel()

//         const plainText = modalStore.content.replace(/<[^>]*>/g, '')
//         const fullText = `${modalStore.title}. ${plainText}`
//         const utterance = new SpeechSynthesisUtterance(fullText)

//         utterance.lang = 'de-DE'
//         utterance.pitch = 1
//         utterance.rate = 0.8

//         window.speechSynthesis.speak(utterance)
//     }
// }

const speak = () => {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel()

        const elements = document.querySelectorAll('[data-tts], .text-body p, .text-body li, .text-body h3')

        elements.forEach((el) => {
            const node = el as HTMLElement
            const text = node.innerText.trim()

            if (text.length > 0) {
                const utterance = new SpeechSynthesisUtterance(text)

                utterance.lang = 'de-DE'
                utterance.pitch = 0.8
                utterance.rate = 0.7

                if (node.tagName.startsWith('H')) {
                    utterance.pitch = 1.1
                }

                window.speechSynthesis.speak(utterance)
            }
        })
    }
}
// watch(
//     () => modalStore.isOpen,
//     (newVal) => {
//         if (!newVal) {
//             window.speechSynthesis.cancel()
//         }
//     },
// )

watch(
    () => modalStore.isOpen,
    async (newVal) => {
        if (newVal) {
            lastFocusedElement = document.activeElement as HTMLElement
            await nextTick()
            closeBtnRef.value?.focus()
            window.addEventListener('keydown', handleKeyDown)
        } else {
            window.speechSynthesis.cancel()
            window.removeEventListener('keydown', handleKeyDown)
            nextTick(() => lastFocusedElement?.focus())
        }
    },
)

const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') modalStore.closeModal()

    if (e.key === 'Tab') {
        const focusable = document.querySelectorAll('.modalContainer button, .modalContainer [href], .modalContainer input')
        if (focusable.length === 0) return

        const first = focusable[0] as HTMLElement
        const last = focusable[focusable.length - 1] as HTMLElement

        if (e.shiftKey && document.activeElement === first) {
            last.focus()
            e.preventDefault()
        } else if (!e.shiftKey && document.activeElement === last) {
            first.focus()
            e.preventDefault()
        }
    }
}
</script>

<template>
    <Teleport to="body">
        <Transition name="slide">
            <div v-if="modalStore.isOpen" class="modalOverlay" @click.self="modalStore.closeModal">
                <div class="modalContainer" role="dialog" aria-modal="true" aria-labelledby="modal-title">
                    <button ref="closeBtnRef" class="closeBtn" @click="modalStore.closeModal">
                        <img src="./icons/closeIcon.svg" alt="" aria-hidden="true" />
                    </button>
                    <div class="modalContent">
                        <button class="speakerBtn" @click="speak">
                            <!-- <img src="./icons/speaker.svg" alt="" aria-hidden="true" /> -->
                            <Speaker aria-hidden="true" />

                            <span class="text-label">{{ t('sideModal.speaker') }}</span>
                        </button>
                        <h2 data-tts>{{ modalStore.title }}</h2>

                        <div data-tts class="text-body" v-html="modalStore.content" role="document"></div>
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<style scoped>
.modalOverlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 1000;
    display: flex;
    justify-content: flex-end;
}

.modalContainer {
    background-color: var(--color-turquise);
    position: relative;
    padding: 20px 25px 0px 25px;
    box-shadow: 0 0 30px 0 rgba(0, 29, 171, 0.42);
}

.speakerBtn {
    margin-top: 10px;
    margin-bottom: 25px;
    display: flex;
    height: 52px;
    padding: 12px 30px 10px 30px;
    align-items: center;
    gap: 5px;
    border-radius: 100px;
    background: var(--color-white);
    color: var(--color-navigation-blue);
    border: none;
}

.text-label {
    color: var(--color-white);
}

@media (min-width: 769px) {
    .modalContainer {
        width: 400px;
        height: 100vh;
    }
}

@media (max-width: 768px) {
    .modalContainer {
        width: 100vw;
        height: 100vh;
    }

    .modalContent {
        margin-top: 60px;
        min-width: 320px;
    }

    h2 {
        text-align: left;
    }
}

.closeBtn {
    position: absolute;
    top: 20px;
    right: 20px;
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
}

.slide-enter-active,
.slide-leave-active {
    transition: transform 0.3s ease;
}
.slide-enter-from,
.slide-leave-to {
    transform: translateX(100%);
}

.speakerBtn:focus-visible,
.closeBtn:focus-visible {
    outline: 3px solid var(--color-navigation-blue);
    outline-offset: 4px;
}

.text-label {
    color: var(--color-navigation-blue);
}
</style>
