<script setup lang="ts">
import { useModalStore } from '@/stores/modalStore'
import { watch } from 'vue';
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const modalStore = useModalStore()

const speak = () => {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();

        const plainText = modalStore.content.replace(/<[^>]*>/g, '');
        
        const fullText = `${modalStore.title}. ${plainText}`;
        
        const utterance = new SpeechSynthesisUtterance(fullText);
        
        utterance.lang = 'de-DE';
        utterance.pitch = 1;
        utterance.rate = 0.8;

        window.speechSynthesis.speak(utterance);
    }
};

watch(() => modalStore.isOpen, (newVal) => {
    if (!newVal) {
        window.speechSynthesis.cancel();
    }
});
</script>

<template>
    <Teleport to="body">
        <Transition name="slide">
            <div v-if="modalStore.isOpen" class="modal-overlay" @click.self="modalStore.closeModal">
                <div class="modal-container">
                    <button class="close-btn" @click="modalStore.closeModal">
                        <img src="./icons/closeIcon.svg" alt="" />
                    </button>
                    <div class="modal-content">
                        <h2>{{ modalStore.title }}</h2>
                        <button class="speaker-btn" @click="speak">
                            <img src="./icons/speaker.svg" alt="" />
                            <span class="text-label">{{ t('sideModal.speaker') }}</span>
                        </button>

                        <div class="text-body" v-html="modalStore.content"></div>
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<style scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.4);
    z-index: 1000;
    display: flex;
    justify-content: flex-end;
}

.modal-container {
    background: white;
    position: relative;
    padding: 40px 25px;
    box-shadow: -5px 0 15px rgba(0, 0, 0, 0.1);
}

.speaker-btn {
    margin-top: 10px;
    margin-bottom: 25px;
    display: flex;
    height: 52px;
    padding: 12px 30px 10px 30px;
    align-items: center;
    gap: 5px;
    border-radius: 100px;
    background: var(--color-navigation-blue);
    color: var(--color-white);
}

.text-label {
    color: var(--color-white);
}

@media (min-width: 769px) {
    .modal-container {
        width: 400px;
        height: 100vh;
    }
}

@media (max-width: 768px) {
    .modal-container {
        width: 100vw;
        height: 100vh;
    }

    .modal-content {
        margin-top: 60px;
        min-width: 320px;
        margin-left: 40px;
        margin-right: 20px;
    }

    h2 {
        text-align: left;
    }
}

.close-btn {
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
</style>
