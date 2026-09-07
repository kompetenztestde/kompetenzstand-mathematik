import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query'
import HomeView from '@/views/HomeView/HomeView.vue'
import { useModalStore } from '@/stores/modalStore'

const mockPush = vi.fn()
vi.mock('vue-router', () => ({
    useRouter: () => ({
        push: mockPush,
    }),
}))

vi.mock('vue-i18n', () => ({
    useI18n: () => ({
        t: (key: string) => key,
    }),
}))

vi.mock('@/queries/utils', () => ({
    inioApiConfiguration: vi.fn().mockResolvedValue({}),
}))

const mockGetItemsGet = vi.fn()
vi.mock('@tba3/api-new', () => ({
    ReportDataTba3Api: vi.fn().mockImplementation(function () {
        return {
            testGroupsTgIdTestsTestIdGroupsGroupIdItemsGet: mockGetItemsGet,
        }
    }),
}))

vi.mock('@/services/configService', () => ({
    configJson: {
        start: {
            title: 'Start Titel',
            info: {
                text: 'Das ist ein Text.',
                important: 'Wichtiger Hinweis',
            },
        },
    },
}))

describe('HomeView.vue', () => {
    let queryClient: QueryClient

    beforeEach(() => {
        vi.clearAllMocks()
        setActivePinia(createPinia())
        queryClient = new QueryClient({
            defaultOptions: { queries: { retry: false } },
        })

        mockGetItemsGet.mockResolvedValue({
            data: {
                studentsData: [{ code: 'USER_A' }, { code: 'USER_B' }],
            },
        })
    })

    const mountComponent = () => {
        return mount(HomeView, {
            global: {
                plugins: [setActivePinia(createPinia()), [VueQueryPlugin, { queryClient }]],
                stubs: {
                    Speaker: true,
                },
            },
        })
    }

    it('sollte das User-Dropdown mit Optionen aus der API füllen', async () => {
        const wrapper = mountComponent()

        await new Promise((r) => setTimeout(r, 10))
        await wrapper.vm.$nextTick()

        const options = wrapper.findAll('select#user-select option')
        expect(options.length).toBe(3)
        expect(options[1]?.text()).toBe('USER_A')
        expect(options[2]?.text()).toBe('USER_B')
    })

    it('sollte den Start-Button deaktivieren, wenn kein User gewählt ist', () => {
        const wrapper = mountComponent()
        const startBtn = wrapper.findAll('button').find((b) => b.text().includes('home.start'))
        expect(startBtn?.attributes('disabled')).toBeDefined()
    })

    it('sollte bei User-Auswahl zum Step-2 navigieren', async () => {
        const wrapper = mountComponent()
        await new Promise((r) => setTimeout(r, 10))

        const select = wrapper.find('select#user-select')
        await select.setValue('USER_A')

        const startBtn = wrapper.findAll('button').find((b) => b.text().includes('home.start'))
        expect(startBtn?.attributes('disabled')).toBeUndefined()

        await startBtn?.trigger('click')

        expect(mockPush).toHaveBeenCalledWith({
            path: '/step-2',
            query: { user: 'USER_A' },
        })
    })

    it('sollte das Modal öffnen, wenn der Info-Button geklickt wird', async () => {
        const wrapper = mountComponent()
        const modalStore = useModalStore()
        const openModalSpy = vi.spyOn(modalStore, 'openModal')

        const infoBtn = wrapper.findAll('button').find((b) => b.text().includes('home.info'))
        await infoBtn?.trigger('click')

        expect(openModalSpy).toHaveBeenCalledWith('Start Titel', 'Das ist ein Text.<br><br><br><br><strong>Wichtiger Hinweis</strong>')
    })
})
