<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import '@/assets/styles/variables.css'
import { useQuery } from '@tanstack/vue-query'
import { inioApiConfiguration } from '@/queries/utils'
import { useI18n } from 'vue-i18n'
import { useModalStore } from '@/stores/modalStore'
import { ReportDataTba3Api } from '@tba3/api-new'
import styles from './styles.module.css'
import Speaker from './icons/speaker.svg?component'
import { configJson } from '@/services/configService'

const modalStore = useModalStore()
const competenceTexts = configJson
const { t } = useI18n()
const router = useRouter()

const selectedUserCode = ref('')
const startAppWithCode = () => {
    if (selectedUserCode.value) {
        router.push({
            path: '/step-2',
            query: { user: selectedUserCode.value },
        })
    }
}

const title = competenceTexts.start.title
const infoText = competenceTexts.start.info.text
const importantText = competenceTexts.start.info.important

const { data: newUserData } = useQuery({
    queryKey: ['new-group-items'],
    queryFn: async () => {
        const config = await inioApiConfiguration()
        const api = new ReportDataTba3Api(config)
        const response = await api.testGroupsTgIdTestsTestIdGroupsGroupIdItemsGet({
            tgId: 270,
            groupId: 1001,
            testId: 9524,
            type: 'students',
        })
        return response.data?.studentsData ?? []
    },
})

watch(newUserData, (newVal) => {
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
    <div :class="styles.greeting">
        <h1>{{ t('home.feedback') }}</h1>
        <div :class="styles.userSelection">
            <label for="user-select">{{ t('home.chooseUser') }}</label>
            <select id="user-select" v-model="selectedUserCode" :class="styles.customSelect">
                <option value="" disabled>{{ t('home.placeHolder') }}</option>
                <option v-for="user in newUserData" :key="user.code" :value="user.code">
                    {{ user.code }}
                </option>
            </select>
        </div>
        <button :class="styles.startBtn" @click="startAppWithCode" :disabled="!selectedUserCode">
            <Speaker />
            <span>{{ t('home.start') }}</span>
        </button>
        <button :class="styles.infoBtn" @click="showDetails" title="Mehr Informationen">
            {{ t('home.info') }}
        </button>
    </div>
    <div :class="styles.mobileIllustration">
        <img src="@/themes/icons/Bocetos1.png" alt="Illustration" />
    </div>

    <div :class="styles.mobileIllustrationBig" class="noPaddingPage">
        <img src="@/themes/icons/Bocetos1_full.png" alt="Illustration" :class="styles.image1" />
        <img src="@/themes/icons/Bocetos2.png" alt="Illustration" :class="styles.image2" />
        <img src="@/themes/icons/Bocetos4.png" alt="Illustration" :class="styles.image4" />
        <img src="@/themes/icons/Bocetos6.png" alt="Illustration" :class="styles.image6" />
        <img src="@/themes/icons/Bocetos7.png" alt="Illustration" :class="styles.image7" />
    </div>
</template>
