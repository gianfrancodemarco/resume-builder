import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createRouter, createWebHistory } from 'vue-router'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import LandingPage from '@/views/LandingPage.vue'

// Mock the onMounted hook to prevent typing animation
vi.mock('vue', async () => {
    const actual = await vi.importActual('vue')
    return {
        ...actual,
        onMounted: vi.fn()
    }
})

describe('LandingPage', () => {
    let wrapper
    let router
    let vuetify

    beforeEach(() => {
        // Create a fresh Vuetify instance for each test
        vuetify = createVuetify({
            components,
            directives,
            icons: {
                defaultSet: 'mdi',
                aliases,
                sets: { mdi }
            }
        })

        // Create router instance with a default route
        router = createRouter({
            history: createWebHistory('/'),
            routes: [
                {
                    path: '/',
                    name: 'landing',
                    component: { template: '<div>Landing</div>' }
                },
                {
                    path: '/editor',
                    name: 'editor',
                    component: { template: '<div>Editor</div>' }
                }
            ]
        })

        wrapper = mount(LandingPage, {
            global: {
                plugins: [router, vuetify],
                stubs: {
                    'v-btn': {
                        template: '<button class="v-btn" :class="$attrs.class"><slot /></button>',
                        props: ['color', 'size', 'elevation', 'to']
                    }
                }
            }
        })
    })

    describe('Component Mounting', () => {
        it('mounts successfully', () => {
            expect(wrapper.exists()).toBe(true)
        })

        it('renders the main landing container', () => {
            const container = wrapper.find('.landing-container')
            expect(container.exists()).toBe(true)
        })

        it('renders the hero section', () => {
            const heroSection = wrapper.find('.hero-section')
            expect(heroSection.exists()).toBe(true)
        })

        it('renders the hero content', () => {
            const heroContent = wrapper.find('.hero-content')
            expect(heroContent.exists()).toBe(true)
        })

        it('renders the hero title', () => {
            const heroTitle = wrapper.find('.hero-title')
            expect(heroTitle.exists()).toBe(true)
            expect(heroTitle.text()).toContain('Create Your Perfect')
            expect(heroTitle.text()).toContain('Resume')
            expect(heroTitle.text()).toContain('in Minutes')
        })

        it('renders the hero description', () => {
            const heroDescription = wrapper.find('.hero-description')
            expect(heroDescription.exists()).toBe(true)
            expect(heroDescription.text()).toContain('Build professional resumes')
        })

        it('renders the CTA button', () => {
            const ctaButton = wrapper.find('.primary-btn')
            expect(ctaButton.exists()).toBe(true)
            expect(ctaButton.text()).toContain('Start Building')
        })

        it('renders the features grid', () => {
            const featuresGrid = wrapper.find('.features-grid')
            expect(featuresGrid.exists()).toBe(true)
        })

        it('renders all feature cards', () => {
            const featureCards = wrapper.findAll('.feature-card')
            expect(featureCards).toHaveLength(4)
        })

        it('renders the footer', () => {
            const footer = wrapper.find('.footer')
            expect(footer.exists()).toBe(true)
        })
    })

    describe('Feature Cards', () => {
        it('renders Free & Open Source feature card', () => {
            const featureCards = wrapper.findAll('.feature-card')
            const freeCard = featureCards[0]

            expect(freeCard.find('.feature-title').text()).toContain('Free & Open Source')
            expect(freeCard.find('.feature-icon').text()).toBe('🚀')
            expect(freeCard.find('.feature-description').text()).toContain('Completely free to use')
        })

        it('renders Multiple Export Formats feature card', () => {
            const featureCards = wrapper.findAll('.feature-card')
            const exportCard = featureCards[1]

            expect(exportCard.find('.feature-title').text()).toContain('Multiple Export Formats')
            expect(exportCard.find('.feature-icon').text()).toBe('📄')
            expect(exportCard.find('.feature-description').text()).toContain('Export to PDF, HTML')
        })

        it('renders Professional Templates feature card', () => {
            const featureCards = wrapper.findAll('.feature-card')
            const templatesCard = featureCards[2]

            expect(templatesCard.find('.feature-title').text()).toContain('Professional Templates')
            expect(templatesCard.find('.feature-icon').text()).toBe('🎨')
            expect(templatesCard.find('.feature-description').text()).toContain('Choose from multiple templates')
        })

        it('renders CV Writing Guide feature card', () => {
            const featureCards = wrapper.findAll('.feature-card')
            const guideCard = featureCards[3]

            expect(guideCard.find('.feature-title').text()).toContain('CV Writing Guide')
            expect(guideCard.find('.feature-icon').text()).toBe('📚')
            expect(guideCard.find('.feature-description').text()).toContain('Learn how to write')
            expect(guideCard.find('.guide-link').exists()).toBe(true)
        })
    })

    describe('Hero Visual', () => {
        it('renders the hero visual section', () => {
            const heroVisual = wrapper.find('.hero-visual')
            expect(heroVisual.exists()).toBe(true)
        })

        it('renders the mockup container', () => {
            const mockupContainer = wrapper.find('.mockup-container')
            expect(mockupContainer.exists()).toBe(true)
        })

        it('renders the mockup screen', () => {
            const mockupScreen = wrapper.find('.mockup-screen')
            expect(mockupScreen.exists()).toBe(true)
        })

        it('renders the mockup header with dots', () => {
            const mockupHeader = wrapper.find('.mockup-header')
            expect(mockupHeader.exists()).toBe(true)

            const dots = wrapper.findAll('.dot')
            expect(dots).toHaveLength(3)
        })

        it('renders the mockup content with columns', () => {
            const mockupContent = wrapper.find('.mockup-content')
            expect(mockupContent.exists()).toBe(true)

            const leftColumn = wrapper.find('.mockup-left-column')
            const rightColumn = wrapper.find('.mockup-right-column')
            expect(leftColumn.exists()).toBe(true)
            expect(rightColumn.exists()).toBe(true)
        })

        it('renders mockup sections with lines', () => {
            const mockupSections = wrapper.findAll('.mockup-section')
            expect(mockupSections.length).toBeGreaterThan(0)

            const mockupLines = wrapper.findAll('.mockup-line')
            expect(mockupLines.length).toBeGreaterThan(0)
        })
    })

    describe('Background Animation', () => {
        it('renders the background animation container', () => {
            const backgroundAnimation = wrapper.find('.background-animation')
            expect(backgroundAnimation.exists()).toBe(true)
        })

        it('renders the gradient background', () => {
            const gradientBg = wrapper.find('.gradient-bg')
            expect(gradientBg.exists()).toBe(true)
        })

        it('renders the floating shapes', () => {
            const floatingShapes = wrapper.find('.floating-shapes')
            expect(floatingShapes.exists()).toBe(true)

            const shapes = wrapper.findAll('.shape')
            expect(shapes).toHaveLength(2)
        })

        it('renders shape-1 and shape-2', () => {
            const shape1 = wrapper.find('.shape-1')
            const shape2 = wrapper.find('.shape-2')
            expect(shape1.exists()).toBe(true)
            expect(shape2.exists()).toBe(true)
        })
    })

    describe('Typing Animation', () => {
        it('renders the typing container', () => {
            const typingContainer = wrapper.find('.typing-container')
            expect(typingContainer.exists()).toBe(true)
        })

        it('renders the typing text element', () => {
            const typingText = wrapper.find('.typing-text')
            expect(typingText.exists()).toBe(true)
        })

        it('renders the cursor element', () => {
            const cursor = wrapper.find('.cursor')
            expect(cursor.exists()).toBe(true)
            expect(cursor.text()).toBe('|')
        })
    })

    describe('Footer', () => {
        it('renders the footer content', () => {
            const footerContent = wrapper.find('.footer-content')
            expect(footerContent.exists()).toBe(true)
        })

        it('renders the footer links', () => {
            const footerLinks = wrapper.find('.footer-links')
            expect(footerLinks.exists()).toBe(true)
        })

        it('renders the gianfrancodemarco.dev link', () => {
            const devLink = wrapper.find('a[href="https://gianfrancodemarco.dev"]')
            expect(devLink.exists()).toBe(true)
            expect(devLink.text()).toContain('gianfrancodemarco.dev')
        })

        it('renders the GitHub link', () => {
            const githubLink = wrapper.find('a[href="https://github.com/gianfrancodemarco/resume-builder"]')
            expect(githubLink.exists()).toBe(true)
            expect(githubLink.text()).toContain('Star on GitHub')
            expect(githubLink.find('.github-icon').text()).toBe('⭐')
        })

        it('renders the footer tagline', () => {
            const footerTagline = wrapper.find('.footer-tagline')
            expect(footerTagline.exists()).toBe(true)
            expect(footerTagline.text()).toContain('Built with ❤️ and Vue.js')
        })

        it('renders the footer separator', () => {
            const footerSeparator = wrapper.find('.footer-separator')
            expect(footerSeparator.exists()).toBe(true)
            expect(footerSeparator.text()).toBe('•')
        })
    })

    describe('CTA Button', () => {
        it('has correct styling classes', () => {
            const ctaButton = wrapper.find('.primary-btn')
            expect(ctaButton.classes()).toContain('primary-btn')
        })

        it('contains the button icon', () => {
            const btnIcon = wrapper.find('.btn-icon')
            expect(btnIcon.exists()).toBe(true)
            expect(btnIcon.text()).toBe('✨')
        })

        it('has correct text content', () => {
            const ctaButton = wrapper.find('.primary-btn')
            expect(ctaButton.text()).toContain('Start Building')
        })
    })

    describe('Guide Link', () => {
        it('renders the guide link with correct href', () => {
            const guideLink = wrapper.find('.guide-link')
            expect(guideLink.exists()).toBe(true)
            expect(guideLink.attributes('href')).toBe('https://github.com/GuidoPenta/galactic-CV-guide-for-developers/blob/main/docs/english.md')
            expect(guideLink.attributes('target')).toBe('_blank')
        })

        it('has correct guide link text', () => {
            const guideLink = wrapper.find('.guide-link')
            expect(guideLink.text()).toContain('Read the Guide →')
        })
    })

    describe('Responsive Design Classes', () => {
        it('has responsive container classes', () => {
            const landingContainer = wrapper.find('.landing-container')
            expect(landingContainer.classes()).toContain('landing-container')
        })

        it('has responsive hero section classes', () => {
            const heroSection = wrapper.find('.hero-section')
            expect(heroSection.classes()).toContain('hero-section')
        })

        it('has responsive features grid classes', () => {
            const featuresGrid = wrapper.find('.features-grid')
            expect(featuresGrid.classes()).toContain('features-grid')
        })
    })

    describe('Animation Classes', () => {
        it('has floating animation classes', () => {
            const shape1 = wrapper.find('.shape-1')
            const shape2 = wrapper.find('.shape-2')
            expect(shape1.classes()).toContain('shape-1')
            expect(shape2.classes()).toContain('shape-2')
        })

        it('has mockup animation classes', () => {
            const mockupContainer = wrapper.find('.mockup-container')
            expect(mockupContainer.classes()).toContain('mockup-container')
        })

        it('has pulse animation classes', () => {
            const mockupLines = wrapper.findAll('.mockup-line')
            mockupLines.forEach(line => {
                expect(line.classes()).toContain('mockup-line')
            })
        })
    })

    describe('Content Validation', () => {
        it('has all required content sections', () => {
            const requiredSections = [
                '.hero-title',
                '.hero-description',
                '.typing-container',
                '.cta-buttons',
                '.features-grid',
                '.footer'
            ]

            requiredSections.forEach(selector => {
                const element = wrapper.find(selector)
                expect(element.exists()).toBe(true)
            })
        })

        it('has correct number of feature cards', () => {
            const featureCards = wrapper.findAll('.feature-card')
            expect(featureCards).toHaveLength(4)
        })

        it('has correct number of mockup sections', () => {
            const mockupSections = wrapper.findAll('.mockup-section')
            expect(mockupSections.length).toBeGreaterThan(0)
        })
    })

    describe('Styling and Layout', () => {
        it('has proper CSS class structure', () => {
            const mainClasses = [
                'landing-container',
                'background-animation',
                'content-wrapper',
                'hero-section',
                'hero-content',
                'hero-visual',
                'features-grid',
                'footer'
            ]

            mainClasses.forEach(className => {
                const element = wrapper.find(`.${className}`)
                expect(element.exists()).toBe(true)
            })
        })

        it('has proper feature card structure', () => {
            const featureCards = wrapper.findAll('.feature-card')
            featureCards.forEach(card => {
                expect(card.find('.feature-icon').exists()).toBe(true)
                expect(card.find('.feature-content').exists()).toBe(true)
                expect(card.find('.feature-title').exists()).toBe(true)
                expect(card.find('.feature-description').exists()).toBe(true)
            })
        })

        it('has proper mockup structure', () => {
            const mockupScreen = wrapper.find('.mockup-screen')
            expect(mockupScreen.find('.mockup-header').exists()).toBe(true)
            expect(mockupScreen.find('.mockup-content').exists()).toBe(true)
        })
    })

    describe('Accessibility', () => {
        it('has proper heading structure', () => {
            const h1 = wrapper.find('h1')
            const h3s = wrapper.findAll('h3')

            expect(h1.exists()).toBe(true)
            expect(h3s.length).toBeGreaterThan(0)
        })

        it('has proper link attributes', () => {
            const links = wrapper.findAll('a')
            links.forEach(link => {
                expect(link.attributes('href')).toBeDefined()
            })
        })

        it('has proper button structure', () => {
            const ctaButton = wrapper.find('.primary-btn')
            expect(ctaButton.exists()).toBe(true)
        })
    })
}) 