<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import '../assets/styles/variables.css'
import competenceTexts from '../assets/competence_guidingideas_texts.json'
import { useQuery } from '@tanstack/vue-query'
import { apiConfiguration } from '@/queries/utils'
import { GroupsApi } from '@tba3/api-resources'
import { useI18n } from 'vue-i18n'
import { useModalStore } from '@/stores/modalStore'

const modalStore = useModalStore()

const { t } = useI18n()
const router = useRouter()
const selectedUserName = ref('')
const startApp = () => {
    if (selectedUserName.value) {
        router.push({
            path: '/step-2',
            query: { user: selectedUserName.value },
        })
    }
}

const title = competenceTexts.start.title
const infoText = competenceTexts.start.info.text
const importantText = competenceTexts.start.info.important

const id = '8b-mathe'
const types = 'students'

const { data: allUsersData } = useQuery({
    queryKey: ['group-items', id, types],
    queryFn: async () => {
        const config = await apiConfiguration()
        const api = new GroupsApi(config)
        const response = await api.getGroupItems({ id: id, type: types })
        return response ?? []
    },
})

watch(allUsersData, (newVal) => {
    if (newVal) {
        console.log('Die Items sind da:', newVal)
    }
})

const showDetails = () => {
    const formattedBody = infoText.replace(/\.($|\s+)/g, '.<br><br>').trim()
    const combinedContent = importantText ? `${formattedBody}<br><br><strong>${importantText}</strong>` : formattedBody

    modalStore.openModal(title, combinedContent)
}
</script>
<template>
    <div>
        <div class="greeting">
            <h1>{{ t('home.feedback') }}</h1>
            <div class="user-selection">
                <label for="user-select">{{ t('home.chooseUser') }}</label>
                <select id="user-select" v-model="selectedUserName" class="custom-select">
                    <option value="" disabled>{{ t('home.placeHolder') }}</option>
                    <option v-for="user in allUsersData" :key="user.id" :value="user.name">
                        {{ user.name }}
                    </option>
                </select>
            </div>
            <button class="startBtn" @click="startApp" :disabled="!selectedUserName">{{ t('home.start') }}</button>
            <button class="infoBtn" @click="showDetails" title="Mehr Informationen">
                {{ t('home.info') }}
            </button>
        </div>
        <img src="@/themes/icons/Bocetos1.png" alt="Illustration" class="mobileIllustration" />

        <div class="mobileIllustrationBig">
            <img src="@/themes/icons/Bocetos1_full.png" alt="Illustration" class="image1" />
            <img src="@/themes/icons/Bocetos2.png" alt="Illustration" class="image2" />
            <img src="@/themes/icons/Bocetos4.png" alt="Illustration" class="image4" />
            <img src="@/themes/icons/Bocetos6.png" alt="Illustration" class="image6" />
            <img src="@/themes/icons/Bocetos7.png" alt="Illustration" class="image7" />
        </div>
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

.startBtn {
    display: inline-flex;
    height: 52px;
    padding: 12px 30px 10px 30px;
    align-items: center;
    gap: 5px;
    border-radius: 100px;
    background: var(--color-navigation-blue);
    color: var(--color-white);
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

.greeting h2 {
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

.modalContent h2 {
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

.fade-enter-active,
.fade-leave-active {
    transition:
        opacity 0.3s ease,
        transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    transform: scale(0.95);
}

.mobileIllustration {
    display: none;
}

@media (max-width: 767px) {
    .mobileIllustration {
        display: block;
        width: 100%;
        max-width: 390px;
        aspect-ratio: 78 / 73;
        height: auto;
        margin-top: 441px;
        margin-bottom: 45px;
        object-fit: contain;
    }

    .greeting {
        position: absolute;
        top: 148px;
        margin-left: 38px;
        margin-right: 38px;
        width: auto;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 15px;
        text-align: center;
    }

    .mobileIllustrationBig {
        display: none;
    }
}

@media (min-width: 768px) and (max-width: 1000px) {
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
    .mobileIllustrationBig {
        display: none;
    }
}

@media (min-width: 1000px) {
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

    .image1 {
        position: absolute;
        top: 385px;
        right: 107px;
        width: 265.96px;
        height: 224.607px;
        aspect-ratio: 45/38;
    }

    .image2 {
        position: absolute;
        margin-top: 43px;
        left: 22px;
        width: 183px;
        height: 177px;
        aspect-ratio: 61/59;
    }
    .image4 {
        position: absolute;
        top: 0px;
        right: 0px;
        width: 324px;
        height: 307px;
        aspect-ratio: 324/307;
    }
    .image6 {
        position: absolute;
        top: 296px;
        left: 0;
        width: 400px;
        height: 400px;
        aspect-ratio: 103/87;
    }
    .image7 {
        position: absolute;
        top: 497px;
        right: 0px;
        width: 520px;
        height: 420px;
        aspect-ratio: 26/21;
    }
}

.user-selection {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin: 20px 0;
}
.custom-select {
    padding: 10px;
    border-radius: 8px;
    border: 1px solid var(--color-navigation-blue);
    font-size: 16px;
    min-width: 250px;
}
.startBtn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background-color: gray;
}
</style>
