import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import { createTestingPinia } from '@pinia/testing'
import GuidingIdeaComponent from '../../components/GuidingIdeaComponent/GuidingIdeaComponent.vue'
import { useModalStore } from '../../stores/modalStore'
import { IconStatus } from '../../types'

const mockRoute = {
    params: {
        subId: undefined as string | undefined,
    },
}

vi.mock('vue-router', () => ({
    useRoute: () => mockRoute,
}))

vi.mock('vue-i18n', () => ({
    useI18n: () => ({
        t: (key: string) => key,
    }),
}))

vi.mock('../../components/GuidingIdeaComponent/icons/raum_und_form.png', () => ({ default: 'raum_und_form.png' }))
vi.mock('../../components/GuidingIdeaComponent/icons/groessen_messen.png', () => ({ default: 'groessen_messen.png' }))
vi.mock('../../components/GuidingIdeaComponent/icons/strukturen.png', () => ({ default: 'strukturen.png' }))
vi.mock('../../components/GuidingIdeaComponent/icons/zahl_und_operationen.png', () => ({ default: 'zahl_und_operationen.png' }))
vi.mock('../../components/GuidingIdeaComponent/icons/Daten_und_Zufall.png', () => ({ default: 'Daten_und_Zufall.png' }))
vi.mock('../../components/GuidingIdeaComponent/icons/celebrate.png', () => ({ default: 'celebrate.png' }))
vi.mock('../../components/GuidingIdeaComponent/icons/contemplative.png', () => ({ default: 'contemplative.png' }))
vi.mock('../../components/GuidingIdeaComponent/icons/neutral.png', () => ({ default: 'neutral.png' }))
vi.mock('../../themes/icons/info.svg?component', () => ({
    default: { template: '<svg id="info-icon" />' },
}))

vi.mock('../../components/GuidingIdeaComponent/styles.module.css', () => {
    const classes = {
        statPaginator: 'statPaginator',
        illustrationHeader: 'illustrationHeader',
        titleRow: 'titleRow',
        infoButton: 'infoButton',
        infoIcon: 'infoIcon',
        icon: 'icon',
        result: 'result',
        celebrate: 'celebrate',
        descriptionText: 'descriptionText',
    }
    return { ...classes, default: classes }
})

vi.mock('../../assets/styles/component-layout.module.css', () => {
    const classes = {
        baseCard: 'baseCard',
        baseIllustration: 'baseIllustration',
        baseContentArea: 'baseContentArea',
    }
    return { ...classes, default: classes }
})

const DummySingleBarChart = defineComponent({
    name: 'SingleBarChart',
    props: ['percentage', 'areas'],
    render() {
        return h('div', { class: 'single-bar-chart-stub' })
    },
})

describe('GuidingIdeaComponent.vue', () => {
    beforeEach(() => {
        mockRoute.params.subId = undefined
    })

    const mockData = [
        {
            label: 'Raum und Form',
            description: 'Beschreibung 1',
            percentage: 80,
            text: 'Text 1',
            areas: [33, 66],
            type: IconStatus.Positive,
        },
        {
            label: 'Größen und Messen',
            description: 'Beschreibung 2',
            percentage: 45,
            text: 'Text 2',
            areas: [20, 80],
            type: IconStatus.Negative,
        },
    ]

    const mountComponent = (props = { data: mockData }) => {
        const pinia = createTestingPinia({
            createSpy: vi.fn,
            stubActions: false,
        })

        const wrapper = mount(GuidingIdeaComponent, {
            props,
            global: {
                plugins: [pinia],
                stubs: {
                    SingleBarChart: DummySingleBarChart,
                },
            },
        })

        const modalStore = useModalStore(pinia)
        return { wrapper, modalStore }
    }

    it('renders nothing when data is empty', () => {
        const { wrapper } = mountComponent({ data: [] })
        expect(wrapper.find('.statPaginator').exists()).toBe(false)
    })

    it('renders first item by default when subId is undefined', () => {
        const { wrapper } = mountComponent()

        expect(wrapper.find('h1').text()).toBe('Raum und Form')
        expect(wrapper.find('.descriptionText').text()).toBe('Text 1')

        const img = wrapper.find('.icon')
        expect(img.exists()).toBe(true)
        expect(img.attributes('src')).toBe('raum_und_form.png')
        expect(img.attributes('style')).toContain('--w-mob: 247px')
    })

    it('selects item based on route subId', () => {
        mockRoute.params.subId = '1'
        const { wrapper } = mountComponent()

        expect(wrapper.find('h1').text()).toBe('Größen und Messen')
        expect(wrapper.find('.descriptionText').text()).toBe('Text 2')

        const img = wrapper.find('.icon')
        expect(img.attributes('src')).toBe('groessen_messen.png')
    })

    it('opens modal on titleRow click', async () => {
        const { wrapper, modalStore } = mountComponent()
        const spyOpenModal = vi.spyOn(modalStore, 'openModal')

        await wrapper.find('.titleRow').trigger('click')

        expect(spyOpenModal).toHaveBeenCalledWith('Raum und Form', 'Beschreibung 1')
    })

    it('renders correct status icon for positive, negative, and neutral statuses', () => {
        const { wrapper: wrapper1 } = mountComponent()
        expect(wrapper1.find('.celebrate').attributes('src')).toBe('celebrate.png')

        mockRoute.params.subId = '1'
        const { wrapper: wrapper2 } = mountComponent()
        expect(wrapper2.find('.celebrate').attributes('src')).toBe('contemplative.png')

        const neutralData = [
            {
                label: 'Daten und Zufall',
                description: 'Neutral item',
                percentage: 50,
                text: 'Text Neutral',
                areas: [33, 66],
                type: IconStatus.Neutral,
            },
        ]
        mockRoute.params.subId = '0'
        const { wrapper: wrapper3 } = mountComponent({ data: neutralData })
        expect(wrapper3.find('.celebrate').attributes('src')).toBe('neutral.png')
    })

    it('passes areas and percentage props to SingleBarChart', () => {
        const { wrapper } = mountComponent()

        const chartStub = wrapper.findComponent(DummySingleBarChart)
        expect(chartStub.exists()).toBe(true)
        expect(chartStub.props('percentage')).toBe(80)
        expect(chartStub.props('areas')).toEqual([33, 66])
    })
})