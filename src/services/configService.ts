import { ref } from 'vue'

export const configJson: any = {}
export const isConfigLoading = ref(true)

export async function loadConfig() {
    try {
        const response = await fetch('/config.json')
        if (!response.ok) throw new Error('Fehler beim Laden der JSON-Konfiguration')
        const data = await response.json()
        Object.assign(configJson, data)
    } catch (error) {
        console.error('Konfigurationsdatei konnte nicht geladen werden:', error)
    } finally {
        isConfigLoading.value = false
    }
}
