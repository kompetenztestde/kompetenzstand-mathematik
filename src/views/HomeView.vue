<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import competenceTexts from '../assets/competence_guidingideas_texts.json'
const router = useRouter()
const startApp = () => {
    router.push(`/step-2`)
}

interface InfoContent {
    title: string
    desc: string
    important: string
}

const title = competenceTexts.start.title
const infoText = competenceTexts.start.info.text
const importantText = competenceTexts.start.info.important

const activeInfo = ref<InfoContent | null>(null)
const showInfo = (title: string, desc: string | undefined, important: string) => {
    activeInfo.value = {
        title: title,
        desc: desc || 'Keine Beschreibung verfügbar.',
        important: important,
    }
}
const closeInfo = () => {
    activeInfo.value = null
}
</script>
<template>
    <div class="greeting">
        <h3>Deine Rückmeldung zu Vera 8 Mathe</h3>
        <button class="startBtn" @click="startApp">Start</button>
        <button class="infoBtn" @click="showInfo(title, infoText, importantText)" title="Mehr Informationen">i</button>

        <Transition name="fade">
            <div v-if="activeInfo" class="modalOverlay" @click="closeInfo">
                <div class="modalContent" @click.stop>
                    <h3>{{ activeInfo.title }}</h3>

                    <p class="modalDesc">{{ activeInfo.desc }}</p>

                    <p v-if="activeInfo.important" class="modalImportant">
                        <strong>{{ activeInfo.important }}</strong>
                    </p>

                    <button @click="closeInfo" class="closeBtn">Schließen</button>
                </div>
            </div>
        </Transition>
    </div>
</template>

<style scoped>
.page {
    padding: 20px;
    text-align: center;
}
button {
    padding: 10px 20px;
    cursor: pointer;
}
.greeting {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
    text-align: center;
}
.startBtn {
    padding: 18px 45px;
    font-size: 1.4rem;
    font-weight: bold;
    background-color: #42b883;
    color: white;
    border: none;
    border-radius: 50px;
    cursor: pointer;
    box-shadow: 0 10px 20px rgba(66, 184, 131, 0.2);
    transition: all 0.3s ease;
}

.startBtn:hover {
    background-color: #3aa876;
    box-shadow: 0 15px 25px rgba(66, 184, 131, 0.3);
}
.modalDesc {
    color: #4a5568;
    line-height: 1.5;
    margin-bottom: 15px;
}

.modalImportant {
    color: #2d3748;
    border-left: 4px solid #42b883;
    padding-left: 10px;
    margin-top: 15px;
}

.modalOverlay {
    position: fixed;
    inset: 0; 
    background: rgba(15, 23, 42, 0.6); 
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    backdrop-filter: blur(5px);
}

.modalContent {
    background: white;
    padding: 30px;
    border-radius: 15px;
    max-width: 400px;
    width: 90%;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
    text-align: left;
}

.greeting h3 {
    margin: 0;
    font-size: 1.8rem;
    color: #2c3e50;
}

.infoBtn {
    background: transparent;
    color: #94a3b8;
    border: 1.5px solid #cbd5e1;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    cursor: pointer;
    font-weight: bold;
    font-style: italic;
    font-family: serif;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
}

.infoBtn:hover {
    color: #64748b;
    border-color: #64748b;
    background-color: #f8fafc;
}

.modalContent h3 {
    margin-top: 0;
    color: #35495e;
}

.modalImportant {
    color: #1e293b;
    background-color: #f0fdf4; 
    border-left: 4px solid #42b883;
    padding: 12px 16px;
    margin: 20px 0;
    border-radius: 4px;
}

.closeBtn {
    width: 100%;
    padding: 12px;
    background-color: #35495e;
    color: white;
    border: none;
    border-radius: 12px;
    font-weight: bold;
    font-size: 1rem;
    cursor: pointer;
    transition: background 0.2s;
}
.closeBtn:hover {
    background-color: #2c3e50;
}

.fade-enter-active, .fade-leave-active {
    transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
    opacity: 0;
    transform: scale(0.95);
}
</style>
