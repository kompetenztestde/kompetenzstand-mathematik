import { ref } from 'vue'
import defaultConfig from '@/assets/competence_guidingideas_texts.json'

export const configJson: any = {}
export const isConfigLoading = ref(true)

export async function loadConfig() {
    Object.assign(configJson, defaultConfig)

    if (!import.meta.env.VITE_EXTERNAL_CONFIG) {
        isConfigLoading.value = false
        return
    }

    try {
        const response = await fetch(`${import.meta.env.BASE_URL}config.json`)
        if (!response.ok) throw new Error('Fehler beim Laden der JSON-Konfiguration')
        const data = await response.json()
        Object.assign(configJson, data)
    } catch (error) {
        console.error('Konfigurationsdatei konnte nicht geladen werden:', error)
        Object.assign(configJson, defaultConfig)
    } finally {
        isConfigLoading.value = false
    }
}
