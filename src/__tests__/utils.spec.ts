import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { apiConfiguration, inioApiConfiguration, inioAuthApiConfiguration } from '../queries/utils'

vi.mock('@tba3/api-resources', () => ({
    Configuration: vi.fn().mockImplementation(function (this: any, param: Record<string, any>) {
        Object.assign(this, param)
    }),
}))

vi.mock('@tba3/api-new', () => ({
    Configuration: vi.fn().mockImplementation(function (this: any, param: Record<string, any>) {
        Object.assign(this, param)
    }),
}))

vi.mock('@tba3/api-auth', () => ({
    Configuration: vi.fn().mockImplementation(function (this: any, param: Record<string, any>) {
        Object.assign(this, param)
    }),
}))

describe('API Configuration Utilities', () => {
    const originalWindowAppConfig = (window as any).appConfig

    beforeEach(() => {
        delete (window as any).appConfig
        vi.unstubAllEnvs()
    })

    afterEach(() => {
        ;(window as any).appConfig = originalWindowAppConfig
        vi.unstubAllEnvs()
    })

    describe('apiConfiguration', () => {
        it('uses baseUrl from window.appConfig if available', async () => {
            ;(window as any).appConfig = {
                api: { baseUrl: 'https://api.example.com' },
            }

            const config = await apiConfiguration()
            expect(config.basePath).toBe('https://api.example.com')
        })

        it('falls back to empty string if window.appConfig is undefined', async () => {
            const config = await apiConfiguration()
            expect(config.basePath).toBe('')
        })
    })

    describe('inioApiConfiguration', () => {
        it('configures basePath and API key from window.appConfig', async () => {
            ;(window as any).appConfig = {
                api: {
                    inioApiUrl: 'https://inio.example.com',
                    xApiKeySchool: 'window-key-123',
                },
            }

            const config = await inioApiConfiguration()
            expect(config.basePath).toBe('https://inio.example.com')
            expect(config.apiKey?.('X-API-KEY-SCHOOL')).toBe('window-key-123')
            expect(config.apiKey?.('OTHER-KEY')).toBe('')
        })

        it('falls back to import.meta.env if window API key is missing', async () => {
            vi.stubEnv('VITE_X_API_KEY_SCHOOL', 'env-key-456')
            ;(window as any).appConfig = {
                api: { inioApiUrl: 'https://inio.example.com' },
            }

            const config = await inioApiConfiguration()
            expect(config.apiKey?.('X-API-KEY-SCHOOL')).toBe('env-key-456')
        })

        it('falls back to default TEST key if no key is defined', async () => {
            delete import.meta.env.VITE_X_API_KEY_SCHOOL

            const config = await inioApiConfiguration()
            expect(config.basePath).toBe('')
            expect(config.apiKey?.('X-API-KEY-SCHOOL')).toBe('TEST')
        })
    })

    describe('inioAuthApiConfiguration', () => {
        it('uses inioAuthApiUrl from window.appConfig', async () => {
            ;(window as any).appConfig = {
                api: { inioAuthApiUrl: 'https://auth.example.com' },
            }

            const config = await inioAuthApiConfiguration()
            expect(config.basePath).toBe('https://auth.example.com')
        })

        it('falls back to empty string when window.appConfig is missing', async () => {
            const config = await inioAuthApiConfiguration()
            expect(config.basePath).toBe('')
        })
    })
})