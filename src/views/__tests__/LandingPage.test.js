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
            expect(heroDescription.text()).toContain('download a PDF that looks')
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

        it('does not render a footer', () => {
            expect(wrapper.find('footer').exists()).toBe(false)
        })
    })

    describe('Feature Cards', () => {
        it.each([
            [0, '📐', 'Pixel-perfect PDF', 'exactly what you download'],
            [1, '🔓', 'Open format, private by design', 'JSON Resume file'],
            [2, '🚀', 'Free & Open Source', 'No sign-up'],
            [3, '📚', 'CV Writing Guide', 'Learn how to write'],
        ])('renders feature card %i: %s %s', (index, icon, title, description) => {
            const card = wrapper.findAll('.feature-card')[index]
            expect(card.find('.feature-icon').text()).toBe(icon)
            expect(card.find('.feature-title').text()).toContain(title)
            expect(card.find('.feature-description').text()).toContain(description)
        })

        it('links to the CV writing guide', () => {
            expect(wrapper.findAll('.feature-card')[3].find('.guide-link').exists()).toBe(true)
        })
    })

    describe('Hero Visual', () => {
        it('shows the two rendered resume layouts', () => {
            const shots = wrapper.findAll('.hero-visual .resume-shot')
            expect(shots.map(img => img.attributes('src'))).toEqual(['/landing/classic.png', '/landing/sidebar.png'])
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

    describe('Navigation', () => {
        it('renders the gianfrancodemarco.dev link', () => {
            const devLink = wrapper.find('.landing-nav a[href="https://gianfrancodemarco.dev"]')
            expect(devLink.exists()).toBe(true)
            expect(devLink.text()).toContain('gianfrancodemarco.dev')
            expect(devLink.attributes('target')).toBe('_blank')
        })

        it('renders the star on GitHub button', () => {
            const starButton = wrapper.find('.landing-nav .star-btn')
            expect(starButton.exists()).toBe(true)
            expect(starButton.text()).toContain('Star')
        })

        it('renders the theme toggle', () => {
            expect(wrapper.find('.landing-nav .theme-toggle').exists()).toBe(true)
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

    })

    describe('Content Validation', () => {
        it('has all required content sections', () => {
            const requiredSections = [
                '.hero-title',
                '.hero-description',
                '.typing-container',
                '.cta-buttons',
                '.features-grid',
                '.landing-nav'
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
                'landing-nav'
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