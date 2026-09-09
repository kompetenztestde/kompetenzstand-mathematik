<script setup>
import { onMounted, ref } from 'vue'
import styles from './styles.module.css'

const confettiItems = ref([])

onMounted(() => {
    startSingleConfettiBurst()
})

const startSingleConfettiBurst = () => {
    const elements = confettiItems.value
    if (!elements.length) return

    elements.forEach((el, i) => {
        const len = elements.length
        const scale = Math.random() * 0.7 + 0.3

        const animation = el.animate(
            [
                {
                    transform: `translate3d(${(i / len) * 100}vw, -10vh, 0) scale(${scale}) rotate(0turn)`,
                    opacity: scale,
                },
                {
                    transform: `translate3d(${(i / len) * 100 + 10}vw, 110vh, 0) scale(${scale}) rotate(${Math.random() > 0.5 ? '' : '-'}2turn)`,
                    opacity: 0,
                },
            ],
            {
                duration: Math.random() * 3000 + 4000,
                iterations: 1,
                fill: 'forwards',
                delay: Math.random() * 2000,
            },
        )

        animation.onfinish = () => {
            el.style.display = 'none'
        }
    })
}
</script>
<template>
    <div class="confettiWrapper">
        <div v-for="i in 80" :key="i" ref="confettiItems" :class="styles.confetti">
            <div :class="styles.rotate">
                <div :class="styles.askew"></div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.confettiWrapper {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 999;
}
</style>
