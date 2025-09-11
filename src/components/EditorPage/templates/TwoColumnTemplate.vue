<template>
    <BaseTemplate v-bind="$props">
        <template #layout="{ orderedSections, processContent }">
            <div class="preview-container">
                <div class="container" :class="{ 'sidebar-left': style.spacing.sidebarLeft }">
                    <div class="sidebar" v-if="isSidebarPresent">
                        <!-- Sidebar Sections -->
                        <template v-for="section in sidebarSections(orderedSections)" :key="section.type">
                            <div class="section">
                                <h2>{{ section.title }}</h2>
                                <!-- Specific rendering for each section type -->
                                <div v-if="section.type === 'skills'">
                                    <div v-for="skill in section.items" :key="skill.name">
                                        <p><strong>{{ skill.name }}:</strong> {{ skill.keywords.join(', ') }}</p>
                                    </div>
                                </div>
                                <div v-else-if="section.type === 'languages'">
                                    <div v-for="lang in section.items" :key="lang.language">
                                        <p><strong>{{ lang.language }}:</strong> {{ lang.fluency }}</p>
                                    </div>
                                </div>
                                <div v-else-if="section.type === 'interests'">
                                    <div v-for="interest in section.items" :key="interest.name">
                                        <p><strong>{{ interest.name }}:</strong> {{ interest.keywords.join(', ') }}</p>
                                    </div>
                                </div>
                                <div v-else>
                                    <!-- Default for other sections in sidebar -->
                                    <div v-for="(item, i) in section.items" :key="i">
                                        <p>{{ item.name || item.title }}</p>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </div>

                    <div class="content">
                        <!-- Header -->
                        <h1>{{ resumeData.basics.name }}</h1>
                        <h2 class="subtitle">{{ resumeData.basics.label }}</h2>

                        <!-- Main Content Sections -->
                        <template v-for="section in mainSections(orderedSections)" :key="section.type">
                            <div class="section">
                                <h2>{{ section.title }}</h2>
                                <div v-if="section.type === 'work'">
                                    <div v-for="job in section.items" :key="job.name">
                                        <p class="job-title">{{ job.position }} - {{ job.name }}</p>
                                        <p class="date">{{ job.startDate }} - {{ job.endDate }}</p>
                                        <p v-html="processContent(job.summary)"></p>
                                    </div>
                                </div>
                                <div v-if="section.type === 'education'">
                                    <div v-for="edu in section.items" :key="edu.institution">
                                        <p class="job-title">{{ edu.studyType }} in {{ edu.area }} - {{ edu.institution
                                            }}</p>
                                        <p class="date">{{ edu.startDate }} - {{ edu.endDate }}</p>
                                        <p>Score: {{ edu.score }}</p>
                                    </div>
                                </div>
                                <div v-if="section.type === 'projects'">
                                    <div v-for="proj in section.items" :key="proj.name">
                                        <p class="job-title">{{ proj.name }}</p>
                                        <p v-html="processContent(proj.description)"></p>
                                    </div>
                                </div>
                                <div v-if="section.type === 'awards'">
                                    <div v-for="award in section.items" :key="award.title">
                                        <p class="job-title">{{ award.title }} - {{ award.awarder }}</p>
                                        <p class="date">{{ award.date }}</p>
                                        <p v-html="processContent(award.summary)"></p>
                                    </div>
                                </div>
                                <div v-if="section.type === 'volunteer'">
                                    <div v-for="item in section.items" :key="item.organization">
                                        <p class="job-title">{{ item.position }} - {{ item.organization }}</p>
                                        <p class="date">{{ item.startDate }} - {{ item.endDate }}</p>
                                        <p v-html="processContent(item.summary)"></p>
                                    </div>
                                </div>
                                <div v-if="section.type === 'certificates'">
                                    <div v-for="cert in section.items" :key="cert.name">
                                        <p><strong>{{ cert.name }}</strong> - {{ cert.issuer }} ({{ cert.date }})</p>
                                    </div>
                                </div>
                                <div v-if="section.type === 'publications'">
                                    <div v-for="pub in section.items" :key="pub.name">
                                        <p class="job-title">{{ pub.name }} - {{ pub.publisher }}</p>
                                        <p class="date">{{ pub.releaseDate }}</p>
                                        <p v-html="processContent(pub.summary)"></p>
                                    </div>
                                </div>
                                <!-- Add rendering for other main sections as needed -->
                            </div>
                        </template>
                    </div>
                </div>
            </div>
        </template>
    </BaseTemplate>
</template>

<script>
import BaseTemplate from './BaseTemplate.vue'

export default {
    name: 'TwoColumnTemplate',
    components: { BaseTemplate },
    props: {
        resumeData: {
            type: Object,
            required: true
        },
        style: {
            type: Object,
            required: true
        }
    },
    computed: {
        isSidebarPresent() {
            return this.style.spacing.sidebarWidth > 0
        },
    },
    methods: {
        sidebarSections(orderedSections) {
            const sidebarSectionKeys = ['skills', 'languages', 'interests', 'references'];
            if (!orderedSections) return [];
            return orderedSections.filter(s => sidebarSectionKeys.includes(s.type));
        },
        mainSections(orderedSections) {
            const sidebarSectionKeys = ['skills', 'languages', 'interests', 'references'];
            if (!orderedSections) return [];
            return orderedSections.filter(s => !sidebarSectionKeys.includes(s.type));
        }
    }
}
</script>