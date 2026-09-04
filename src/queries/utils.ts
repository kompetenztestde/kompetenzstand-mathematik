import { Configuration } from '@tba3/api-resources'
import { Configuration as Configuration2 } from '@tba3/api-new'
import { Configuration as ConfigurationAuth } from '@tba3/api-auth'
import { DEMO_API_KEY_SCHOOL, useAuthStore } from '@/stores/auth'

type CustomWindow = Window & {
    appConfig?: {
        api?: {
            baseUrl?: string
            inioApiUrl?: string
            inioAuthApiUrl?: string
            xApiKeySchool?: string
        }
        defaultPageSize?: number
    }
}

export async function apiConfiguration(): Promise<Configuration> {
    const configFromWindow = (window as CustomWindow).appConfig?.api?.baseUrl || ''
    const config = new Configuration({ basePath: configFromWindow })
    return config
}

export async function inioApiConfiguration(forceDemoAccess = false, tokenOverride?: string): Promise<Configuration2> {
    const auth = useAuthStore()
    const configFromWindow = (window as CustomWindow).appConfig?.api?.inioApiUrl || ''
    const apiKey = DEMO_API_KEY_SCHOOL
    const isDemoAccess = forceDemoAccess || auth.isDemoAccess
    const accessToken = tokenOverride ?? auth.token
    const config = new Configuration2(
        isDemoAccess && apiKey
            ? {
                  basePath: configFromWindow,
                  apiKey: (name: string) => (name === 'X-API-KEY-SCHOOL' ? apiKey : ''),
              }
            : { basePath: configFromWindow, accessToken: accessToken ?? undefined },
    )
    return config
}

export async function inioAuthApiConfiguration(): Promise<ConfigurationAuth> {
    const configFromWindow = (window as CustomWindow).appConfig?.api?.inioAuthApiUrl || ''
    const config = new ConfigurationAuth({ basePath: configFromWindow })
    return config
}
