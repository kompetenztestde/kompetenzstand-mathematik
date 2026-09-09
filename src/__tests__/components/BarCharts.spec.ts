import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import { createTestingPinia } from '@pinia/testing'
import BarCharts from '../../components/BarCharts/BarCharts.vue'
import { useModalStore } from '../../stores/modalStore'

vi.mock('vue-i18n', () => ({
    useI18n: () => ({
        t: (key: string) => key,
    }),
}))

vi.mock('../../components/BarCharts/icons/contemplative.png', () => ({ default: 'contemplative-stub.png' }))

vi.mock('../../components/BarCharts/styles.module.css', () => {
    const classes = {
        page: 'page',
        mainLayout: 'mainLayout',
        labelsColumn: 'labelsColumn',
        yAxisLabel: 'yAxisLabel',
        labelText: 'labelText',
        infoCircle: 'infoCircle',
        chartContainer: 'chartContainer',
        contemplative: 'contemplative',
        chartBackgroundWrapper: 'chartBackgroundWrapper',
        waveLayer: 'waveLayer',
        waveDark: 'waveDark',
        waveMedium: 'waveMedium',
        waveLight: 'waveLight',
        areaBorder: 'areaBorder',
        chart: 'chart',
        scaleLabelsRow: 'scaleLabelsRow',
        scaleLabel: 'scaleLabel',
    }
    return {
        ...classes,
        default: classes,
    }
})

const DummyVChart = defineComponent({
    name: 'VueECharts',
    props: ['option', 'initOptions'],
    emits: ['click'],
    render() {
        return h('div', {
            class: 'v-chart-stub',
            onClick: () => this.$emit('click', { componentType: 'series', dataIndex: 0 }),
        })
    },
})

describe('BarCharts.vue', () => {
    const mockBadPerformers = [
        {
            label: 'Thema A',
            text: 'Text A',
            description: 'Beschreibung A',
            hits: 5,
            total: 10,
            percentage: 50,
        },
        {
            label: 'Thema B',
            text: 'Text B ohne Description',
            description: '',
            hits: 2,
            total: 10,
            percentage: 20,
        },
    ]

    const mountComponent = (props = { badPerformers: mockBadPerformers, areas: [30, 70] }) => {
        const pinia = createTestingPinia({
            createSpy: vi.fn,
            stubActions: false,
        })

        const wrapper = mount(BarCharts, {
            props,
            global: {
                plugins: [pinia],
                stubs: {
                    VChart: DummyVChart,
                },
            },
        })

        const modalStore = useModalStore(pinia)
        return { wrapper, modalStore }
    }

    it('renders all bad performer labels and scale text', () => {
        const { wrapper } = mountComponent()

        const labels = wrapper.findAll('.yAxisLabel')
        expect(labels).toHaveLength(2)
        expect(labels[0].text()).toContain('Thema A')
        expect(labels[1].text()).toContain('Thema B')

        const scaleLabels = wrapper.findAll('.scaleLabel')
        expect(scaleLabels).toHaveLength(3)
        expect(scaleLabels[0].text()).toBe('areas.first')
        expect(scaleLabels[1].text()).toBe('areas.middle')
        expect(scaleLabels[2].text()).toBe('areas.last')
    })

    it('opens modal with description when a label is clicked', async () => {
        const { wrapper, modalStore } = mountComponent()
        const spyOpenModal = vi.spyOn(modalStore, 'openModal')

        const firstLabel = wrapper.findAll('.yAxisLabel')[0]
        await firstLabel.trigger('click')

        expect(spyOpenModal).toHaveBeenCalledWith('Thema A', 'Beschreibung A')
    })

    it('falls back to text when description is empty on label click', async () => {
        const { wrapper, modalStore } = mountComponent()
        const spyOpenModal = vi.spyOn(modalStore, 'openModal')

        const secondLabel = wrapper.findAll('.yAxisLabel')[1]
        await secondLabel.trigger('click')

        expect(spyOpenModal).toHaveBeenCalledWith('Thema B', 'Text B ohne Description')
    })

    it('handles chart click event on series item', async () => {
        const { wrapper, modalStore } = mountComponent()
        const spyOpenModal = vi.spyOn(modalStore, 'openModal')

        const chartStub = wrapper.findComponent(DummyVChart)
        chartStub.vm.$emit('click', { componentType: 'series', dataIndex: 0 })

        expect(spyOpenModal).toHaveBeenCalledWith('Thema A', 'Beschreibung A')
    })

    it('handles chart click event on yAxis item', async () => {
        const { wrapper, modalStore } = mountComponent()
        const spyOpenModal = vi.spyOn(modalStore, 'openModal')

        const chartStub = wrapper.findComponent(DummyVChart)
        chartStub.vm.$emit('click', { componentType: 'yAxis', value: 'Thema B' })

        expect(spyOpenModal).toHaveBeenCalledWith('Thema B', 'Text B ohne Description')
    })

    it('calculates background mask gradients and border positions correctly', () => {
        const { wrapper } = mountComponent({ badPerformers: mockBadPerformers, areas: [25, 75] })

        const borders = wrapper.findAll('.areaBorder')
        expect(borders[0].attributes('style')).toContain('left: 25%')
        expect(borders[1].attributes('style')).toContain('left: 75%')

        const waveDark = wrapper.find('.waveDark')
        const waveMedium = wrapper.find('.waveMedium')
        const waveLight = wrapper.find('.waveLight')

        expect(waveDark.attributes('style')).toContain('25%')
        expect(waveMedium.attributes('style')).toContain('25%')
        expect(waveMedium.attributes('style')).toContain('75%')
        expect(waveLight.attributes('style')).toContain('75%')
    })

    it('passes correct options and data to VChart', () => {
        const { wrapper } = mountComponent()

        const chartStub = wrapper.findComponent(DummyVChart)
        const option = chartStub.props('option')

        expect(option.yAxis.data).toEqual(['Thema A', 'Thema B'])
        expect(option.series[0].data).toEqual([50, 20])
        expect(option.series[0].type).toBe('bar')
    })
})
