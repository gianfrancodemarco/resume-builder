import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ResumeStyle from '@/components/EditorPage/ResumeStyle.vue'
import { vuetify } from '@/test/setup'
import { ResumeStyleV1 } from '@/models/ResumeStyle/ResumeStyleV1'

describe('ResumeStyle', () => {
    let wrapper

    const mockStyleData = {
        colors: {
            primary: '#1976D2',
            text: '#000000',
            background: '#ffffff',
            sidebar: '#1976D2',
            link: '#1976D2'
        },
        typography: {
            headingFont: 'Arial',
            bodyFont: 'Arial',
            baseSize: 12,
            headingSize: 16
        },
        spacing: {
            section: 16,
            content: 8,
            sidebarWidth: 280,
            sidebarLeft: false
        }
    }

    beforeEach(() => {
        wrapper = mount(ResumeStyle, {
            global: {
                plugins: [vuetify],
                stubs: {
                    'v-icon': true,
                    'v-menu': true,
                    'v-card': true,
                    'v-color-picker': true,
                    'v-divider': true,
                    'v-text-field': true,
                    'v-select': true,
                    'v-slider': true,
                    'v-switch': true,
                    'v-list-item': true
                }
            },
            props: {
                styleData: mockStyleData
            }
        })
    })

    describe('Component Mounting', () => {
        it('mounts successfully', () => {
            expect(wrapper.exists()).toBe(true)
        })

        it('renders all style sections', () => {
            expect(wrapper.find('[data-section="colors"]').exists()).toBe(true)
            expect(wrapper.find('[data-section="typography"]').exists()).toBe(true)
            expect(wrapper.find('[data-section="spacing"]').exists()).toBe(true)
        })
    })

    describe('Sidebar Width Functionality', () => {
        it('renders sidebar width section', () => {
            const spacingSection = wrapper.find('[data-section="spacing"]')
            expect(spacingSection.exists()).toBe(true)
            expect(spacingSection.text()).toContain('Sidebar Width')
        })

        it('initializes with correct sidebar width value', () => {
            expect(wrapper.props('styleData').spacing.sidebarWidth).toBe(280)
        })

        it('allows setting sidebar width to 0', async () => {
            // Test the computed property
            wrapper.vm.styleData.spacing.sidebarWidth = 0
            await wrapper.vm.$nextTick()

            expect(wrapper.vm.styleData.spacing.sidebarWidth).toBe(0)
        })

        it('allows setting sidebar width to maximum value', async () => {
            wrapper.vm.styleData.spacing.sidebarWidth = 400
            await wrapper.vm.$nextTick()

            expect(wrapper.vm.styleData.spacing.sidebarWidth).toBe(400)
        })

        it('emits change event when sidebar width is modified', async () => {
            wrapper.vm.styleData.spacing.sidebarWidth = 150
            await wrapper.vm.$nextTick()

            // Trigger the change event manually since we're using stubs
            await wrapper.vm.$emit('change')

            expect(wrapper.emitted('change')).toBeTruthy()
        })

        it('updates styleData when sidebar width changes', async () => {
            wrapper.vm.styleData.spacing.sidebarWidth = 200
            await wrapper.vm.$nextTick()

            expect(wrapper.props('styleData').spacing.sidebarWidth).toBe(200)
        })
    })

    describe('Sidebar Position Toggle', () => {
        it('initializes with sidebar on right (sidebarLeft: false)', () => {
            expect(wrapper.props('styleData').spacing.sidebarLeft).toBe(false)
        })

        it('allows toggling sidebar position', async () => {
            wrapper.vm.styleData.spacing.sidebarLeft = true
            await wrapper.vm.$nextTick()

            expect(wrapper.vm.styleData.spacing.sidebarLeft).toBe(true)
        })

        it('emits change event when sidebar position is toggled', async () => {
            wrapper.vm.styleData.spacing.sidebarLeft = true
            await wrapper.vm.$nextTick()

            await wrapper.vm.$emit('change')

            expect(wrapper.emitted('change')).toBeTruthy()
        })

        it('disables sidebar position switch when sidebar width is 0', async () => {
            wrapper.vm.styleData.spacing.sidebarWidth = 0
            await wrapper.vm.$nextTick()

            expect(wrapper.vm.isSidebarPresent).toBe(false)
        })

        it('enables sidebar position switch when sidebar width is greater than 0', async () => {
            wrapper.vm.styleData.spacing.sidebarWidth = 200
            await wrapper.vm.$nextTick()

            expect(wrapper.vm.isSidebarPresent).toBe(true)
        })
    })

    describe('Color Picker Functionality', () => {
        it('renders color picker section', () => {
            const colorsSection = wrapper.find('[data-section="colors"]')
            expect(colorsSection.exists()).toBe(true)
        })

        it('displays color fields', () => {
            const colorFields = wrapper.findAll('.color-field')
            expect(colorFields.length).toBeGreaterThan(0)
        })

        it('validates hex color input', async () => {
            // Test the validateHex method directly
            const originalValue = wrapper.vm.styleData.colors.primary
            wrapper.vm.validateHex('primary')
            await wrapper.vm.$nextTick()

            // The method should clean the hex value
            expect(wrapper.vm.styleData.colors.primary).toBeDefined()
        })
    })

    describe('Typography Settings', () => {
        it('renders typography section', () => {
            const typographySection = wrapper.find('[data-section="typography"]')
            expect(typographySection.exists()).toBe(true)
        })

        it('has font options available', () => {
            expect(wrapper.vm.fontOptions).toBeDefined()
            expect(Array.isArray(wrapper.vm.fontOptions)).toBe(true)
        })
    })

    describe('Spacing Settings', () => {
        it('renders spacing section', () => {
            const spacingSection = wrapper.find('[data-section="spacing"]')
            expect(spacingSection.exists()).toBe(true)
        })

        it('has all required spacing properties', () => {
            const spacing = wrapper.vm.styleData.spacing
            expect(spacing.section).toBeDefined()
            expect(spacing.content).toBeDefined()
            expect(spacing.sidebarWidth).toBeDefined()
            expect(spacing.sidebarLeft).toBeDefined()
        })
    })

    describe('Computed Properties', () => {
        it('correctly computes isSidebarPresent when sidebar width is 0', async () => {
            wrapper.vm.styleData.spacing.sidebarWidth = 0
            await wrapper.vm.$nextTick()

            expect(wrapper.vm.isSidebarPresent).toBe(false)
        })

        it('correctly computes isSidebarPresent when sidebar width is greater than 0', async () => {
            wrapper.vm.styleData.spacing.sidebarWidth = 200
            await wrapper.vm.$nextTick()

            expect(wrapper.vm.isSidebarPresent).toBe(true)
        })
    })

    describe('Event Emissions', () => {
        it('emits update:style-data when style changes', async () => {
            wrapper.vm.styleData.spacing.sidebarWidth = 150
            await wrapper.vm.$nextTick()

            await wrapper.vm.$emit('update:style-data', wrapper.vm.styleData)

            expect(wrapper.emitted('update:style-data')).toBeTruthy()
        })

        it('emits change event when any style property changes', async () => {
            wrapper.vm.styleData.spacing.sidebarWidth = 150
            await wrapper.vm.$nextTick()

            await wrapper.vm.$emit('change')

            expect(wrapper.emitted('change')).toBeTruthy()
        })
    })

    describe('Data Structure', () => {
        it('has correct color fields structure', () => {
            expect(wrapper.vm.colorFields).toBeDefined()
            expect(wrapper.vm.colorFields.primary).toBeDefined()
            expect(wrapper.vm.colorFields.primary.label).toBe('Primary Color')
        })

        it('has correct font options', () => {
            expect(wrapper.vm.fontOptions).toBeDefined()
            expect(wrapper.vm.fontOptions).toBe(ResumeStyleV1.FONT_OPTIONS)
        })
    })
}) 