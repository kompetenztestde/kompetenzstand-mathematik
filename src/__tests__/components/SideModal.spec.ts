import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import SideModal from '../../components/SideModal/SideModal.vue'
import { useModalStore } from '../../stores/modalStore'
import { nextTick } from 'vue'

vi.mock('vue-i18n', () => ({
    useI18n: () => ({
        t: (key: string) => key,
    }),
}))

vi.mock('../../components/SideModal/icons/speaker.svg?component', () => ({ default: { template: '<svg id="speaker-icon" />' } }))
vi.mock('../../components/SideModal/icons/stopIcon2.svg?component', () => ({ default: { template: '<svg id="stop-icon" />' } }))
vi.mock('../../components/SideModal/icons/startIcon.svg?component', () => ({ default: { template: '<svg id="start-icon" />' } }))
vi.mock('../../components/SideModal/icons/closeIcon.svg?component', () => ({ default: { template: '<svg id="close-icon" />' } }))

describe('SideModal.vue', () => {
    const mockSpeechSynthesis = {
        speak: vi.fn(),
        cancel: vi.fn(),
        resume: vi.fn(),
        pause: vi.fn(),
        paused: false,
        speaking: false,
    }

    beforeEach(() => {
        vi.stubGlobal('speechSynthesis', mockSpeechSynthesis)

        function MockUtterance(this: any, text: string) {
            this.text = text
            this.lang = ''
            this.pitch = 1
            this.rate = 1
            this.onstart = null
            this.onend = null
            this.onerror = null
        }

        vi.stubGlobal('SpeechSynthesisUtterance', vi.fn().mockImplementation(MockUtterance))

        if (!Object.prototype.hasOwnProperty.call(HTMLElement.prototype, 'innerText')) {
            Object.defineProperty(HTMLElement.prototype, 'innerText', {
                get() {
                    return this.textContent || ''
                },
                configurable: true,
            })
        }
    })

    afterEach(() => {
        vi.restoreAllMocks()
        document.body.innerHTML = ''
    })

    const setupWrapperAndStore = (initialState = { isOpen: true, title: 'Test Titel', content: '<p>Test Inhalt</p>' }) => {
        const pinia = createTestingPinia({
            createSpy: vi.fn,
            stubActions: false,
        })

        const modalStore = useModalStore(pinia)
        modalStore.$patch(initialState)

        const wrapper = mount(SideModal, {
            attachTo: document.body,
            global: {
                plugins: [pinia],
            },
        })

        return { wrapper, modalStore }
    }

    it('renders title and content from modalStore when open', async () => {
        setupWrapperAndStore({ isOpen: true, title: 'Test Titel', content: '<p>Test Inhalt</p>' })
        await nextTick()

        expect(document.body.textContent).toContain('Test Titel')
        expect(document.body.textContent).toContain('Test Inhalt')
        expect(document.body.textContent).toContain('sideModal.speaker')
    })

    it('does not render modal content when store.isOpen is false', async () => {
        setupWrapperAndStore({ isOpen: false, title: 'Titel', content: 'Inhalt' })
        await nextTick()

        const dialog = document.querySelector('[role="dialog"]')
        expect(dialog).toBeNull()
    })

    it('calls modalStore.closeModal when close button or overlay is clicked', async () => {
        const { modalStore } = setupWrapperAndStore({ isOpen: true, title: 'Test Titel', content: '<p>Test Inhalt</p>' })
        await nextTick()

        const spyClose = vi.spyOn(modalStore, 'closeModal')

        const closeBtn = document.querySelector('button') as HTMLButtonElement
        expect(closeBtn).not.toBeNull()
        closeBtn.click()

        expect(spyClose).toHaveBeenCalledTimes(1)
    })

    it('closes modal when Escape key is pressed', async () => {
        const { wrapper, modalStore } = setupWrapperAndStore({ isOpen: false, title: 'Test Titel', content: '<p>Test Inhalt</p>' })
        await nextTick()

        modalStore.isOpen = true
        await nextTick()
        await nextTick()

        const escapeEvent = new KeyboardEvent('keydown', {
            key: 'Escape',
            code: 'Escape',
            keyCode: 27,
            which: 27,
            bubbles: true,
            cancelable: true,
        })

        if (document.activeElement && document.activeElement !== document.body) {
            document.activeElement.dispatchEvent(escapeEvent)
        } else {
            window.dispatchEvent(escapeEvent)
            document.dispatchEvent(escapeEvent)
        }

        await nextTick()

        expect(modalStore.closeModal).toHaveBeenCalledTimes(1)
    })

    it('triggers speech synthesis when speaker button is clicked', async () => {
        setupWrapperAndStore({ isOpen: true, title: 'Test Titel', content: '<p>Test Inhalt</p>' })
        await nextTick()

        const speakerBtn = document.querySelector('._speakerBtn_9e51ce, button:nth-of-type(2)') as HTMLButtonElement
        expect(speakerBtn).not.toBeNull()

        speakerBtn.click()

        expect(mockSpeechSynthesis.cancel).toHaveBeenCalled()
        expect(mockSpeechSynthesis.speak).toHaveBeenCalled()
    })

    it('focuses close button when modal opens', async () => {
        const { modalStore } = setupWrapperAndStore({ isOpen: false, title: 'Test Titel', content: '<p>Test Inhalt</p>' })
        await nextTick()

        modalStore.isOpen = true
        await nextTick()
        await nextTick()

        const closeBtn = document.querySelector('button')
        expect(document.activeElement).toBe(closeBtn)
    })
})
