import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { configJson, isConfigLoading, loadConfig } from '@/services/configService' 

describe('configService', () => {
    beforeEach(() => {
        isConfigLoading.value = true
        for (const key in configJson) {
            delete configJson[key]
        }
        vi.restoreAllMocks()
    })

    afterEach(() => {
        vi.unstubAllGlobals()
    })

    it('sollte die Konfiguration erfolgreich laden und den Status aktualisieren', async () => {
        const mockData = { specialCases: { K1A: 'Test' }, overallResult: {} }

        vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
            ok: true,
            json: vi.fn().mockResolvedValue(mockData),
        }))

        await loadConfig()

        expect(fetch).toHaveBeenCalledWith('/config.json')
        expect(configJson).toEqual(mockData)
        expect(isConfigLoading.value).toBe(false)
    })

    it('sollte Fehler abfangen und isConfigLoading trotzdem auf false setzen', async () => {
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

        vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
            ok: false,
            status: 404,
        }))

        await loadConfig()

        expect(configJson).toEqual({})
        expect(isConfigLoading.value).toBe(false)
        expect(consoleSpy).toHaveBeenCalledWith(
            'Konfigurationsdatei konnte nicht geladen werden:',
            expect.any(Error)
        )
    })

    it('sollte Netzwerk- oder Parsing-Fehler abfangen', async () => {
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

        vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network error')))

        await loadConfig()

        expect(configJson).toEqual({})
        expect(isConfigLoading.value).toBe(false)
        expect(consoleSpy).toHaveBeenCalled()
    })
})