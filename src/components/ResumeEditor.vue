<template>
  <v-card class="pa-4" style="height: calc(100vh - 32px); overflow-y: auto;">
    <v-expansion-panels>
      <!-- Personal / Sidebar -->
      <v-expansion-panel>
        <v-expansion-panel-title>About Me</v-expansion-panel-title>
        <v-expansion-panel-text>
          <div class="d-flex justify-end mb-4">
            <v-checkbox v-model="local.personal.visible" label="Hide section" hide-details density="compact" />
          </div>
          <v-text-field v-model="local.personal.name" label="Name" :disabled="!local.personal.visible" />
          <v-text-field v-model="local.personal.title" label="Title" :disabled="!local.personal.visible" />
          <v-textarea v-model="local.personal.about[0]" label="Descrizione 1" :disabled="!local.personal.visible" />
          <v-textarea v-model="local.personal.about[1]" label="Descrizione 2" :disabled="!local.personal.visible" />
        </v-expansion-panel-text>
      </v-expansion-panel>

      <v-expansion-panel>
        <v-expansion-panel-title>Details</v-expansion-panel-title>
        <v-expansion-panel-text>
          <div class="d-flex justify-end mb-4">
            <v-checkbox v-model="local.personal.detailsVisible" label="Hide section" hide-details density="compact" />
          </div>
          <v-text-field v-model="local.personal.location" label="Location" :disabled="!local.personal.detailsVisible" />
          <v-text-field v-model="local.personal.email" label="Email" :disabled="!local.personal.detailsVisible" />
        </v-expansion-panel-text>
      </v-expansion-panel>

      <v-expansion-panel>
        <v-expansion-panel-title>Links</v-expansion-panel-title>
        <v-expansion-panel-text>
          <div class="d-flex justify-end mb-4">
            <v-checkbox v-model="local.personal.linksVisible" label="Hide section" hide-details density="compact" />
          </div>
          <div v-for="(link, index) in local.personal.links" :key="index" class="d-flex align-center mb-2">
            <v-text-field v-model="local.personal.links[index]" label="Link" readonly
              :disabled="!local.personal.linksVisible" />
            <v-btn icon="mdi-delete" color="error" variant="text" @click="removeLink(index)" class="ml-2"
              :disabled="!local.personal.linksVisible" />
          </div>
          <v-text-field v-model="link" label="Aggiungi link (url)" :disabled="!local.personal.linksVisible" />
          <v-btn small @click="addLink" :disabled="!local.personal.linksVisible">Aggiungi</v-btn>
        </v-expansion-panel-text>
      </v-expansion-panel>

      <v-expansion-panel>
        <v-expansion-panel-title>Skills</v-expansion-panel-title>
        <v-expansion-panel-text>
          <div class="d-flex justify-end mb-4">
            <v-checkbox v-model="local.skillsVisible" label="Hide section" hide-details density="compact" />
          </div>
          <div v-for="(skill, index) in local.skills" :key="index" class="d-flex align-center mb-2">
            <v-text-field v-model="local.skills[index]" label="Skill" readonly :disabled="!local.skillsVisible" />
            <v-btn icon="mdi-delete" color="error" variant="text" @click="removeSkill(index)" class="ml-2"
              :disabled="!local.skillsVisible" />
          </div>
          <v-text-field v-model="skill" label="Skill" :disabled="!local.skillsVisible" />
          <v-btn small @click="addSkill" :disabled="!local.skillsVisible">Aggiungi</v-btn>
        </v-expansion-panel-text>
      </v-expansion-panel>

      <v-expansion-panel>
        <v-expansion-panel-title>Languages</v-expansion-panel-title>
        <v-expansion-panel-text>
          <div class="d-flex justify-end mb-4">
            <v-checkbox v-model="local.languagesVisible" label="Hide section" hide-details density="compact" />
          </div>
          <div v-for="(lang, index) in local.languages" :key="index" class="d-flex align-center mb-2">
            <v-text-field v-model="local.languages[index].name" label="Lingua" readonly
              :disabled="!local.languagesVisible" />
            <v-text-field v-model="local.languages[index].proficiency" label="Proficiency (%)" readonly class="mx-2"
              :disabled="!local.languagesVisible" />
            <v-btn icon="mdi-delete" color="error" variant="text" @click="removeLang(index)" class="ml-2"
              :disabled="!local.languagesVisible" />
          </div>
          <v-text-field v-model="lang.name" label="Lingua" :disabled="!local.languagesVisible" />
          <v-text-field v-model="lang.proficiency" label="Proficiency (%)" :disabled="!local.languagesVisible" />
          <v-btn small @click="addLang" :disabled="!local.languagesVisible">Aggiungi</v-btn>
        </v-expansion-panel-text>
      </v-expansion-panel>

      <v-expansion-panel>
        <v-expansion-panel-title>Esperienze</v-expansion-panel-title>
        <v-expansion-panel-text>
          <div class="d-flex justify-end mb-4">
            <v-checkbox v-model="local.experiencesVisible" label="Hide section" hide-details density="compact" />
          </div>
          <div v-for="(exp, index) in local.experiences" :key="index" class="mb-4">
            <div class="d-flex align-center mb-2">
              <v-text-field v-model="local.experiences[index].title" label="Job title" readonly
                :disabled="!local.experiencesVisible" />
              <v-btn icon="mdi-delete" color="error" variant="text" @click="removeExp(index)" class="ml-2"
                :disabled="!local.experiencesVisible" />
            </div>
            <v-text-field v-model="local.experiences[index].company" label="Company (+ location)" readonly
              :disabled="!local.experiencesVisible" />
            <v-text-field v-model="local.experiences[index].period" label="Periodo" readonly
              :disabled="!local.experiencesVisible" />
            <v-textarea v-model="local.experiences[index].description" label="Descrizione" readonly
              :disabled="!local.experiencesVisible" />
          </div>
          <v-text-field v-model="exp.title" label="Job title" :disabled="!local.experiencesVisible" />
          <v-text-field v-model="exp.company" label="Company (+ location)" :disabled="!local.experiencesVisible" />
          <v-text-field v-model="exp.period" label="Periodo" :disabled="!local.experiencesVisible" />
          <v-textarea v-model="exp.description" label="Descrizione" :disabled="!local.experiencesVisible" />
          <v-btn small @click="addExp" :disabled="!local.experiencesVisible">Aggiungi</v-btn>
        </v-expansion-panel-text>
      </v-expansion-panel>

      <v-expansion-panel>
        <v-expansion-panel-title>Education</v-expansion-panel-title>
        <v-expansion-panel-text>
          <div class="d-flex justify-end mb-4">
            <v-checkbox v-model="local.educationVisible" label="Hide section" hide-details density="compact" />
          </div>
          <div v-for="(edu, index) in local.education" :key="index" class="mb-4">
            <div class="d-flex align-center mb-2">
              <v-text-field v-model="local.education[index].degree" label="Degree" readonly
                :disabled="!local.educationVisible" />
              <v-btn icon="mdi-delete" color="error" variant="text" @click="removeEdu(index)" class="ml-2"
                :disabled="!local.educationVisible" />
            </div>
            <v-text-field v-model="local.education[index].period" label="Periodo" readonly
              :disabled="!local.educationVisible" />
            <v-text-field v-model="local.education[index].mark" label="Voto" readonly
              :disabled="!local.educationVisible" />
            <v-textarea v-model="local.education[index].thesis" label="Thesis / Note" readonly
              :disabled="!local.educationVisible" />
          </div>
          <v-text-field v-model="edu.degree" label="Degree" :disabled="!local.educationVisible" />
          <v-text-field v-model="edu.period" label="Periodo" :disabled="!local.educationVisible" />
          <v-text-field v-model="edu.mark" label="Voto" :disabled="!local.educationVisible" />
          <v-textarea v-model="edu.thesis" label="Thesis / Note" :disabled="!local.educationVisible" />
          <v-btn small @click="addEdu" :disabled="!local.educationVisible">Aggiungi</v-btn>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-card>
</template>

<script>
export default {
  props: {
    resumeData: {
      type: Object,
      required: true
    }
  },
  emits: ['update:resume-data'],
  data() {
    return {
      local: this.resumeData,
      link: '',
      skill: '',
      lang: { name: '', proficiency: 100 },
      exp: { title: '', company: '', period: '', description: '' },
      edu: { degree: '', period: '', mark: '', thesis: '' }
    }
  },
  watch: {
    local: {
      handler(newVal) {
        this.$emit('update:resume-data', newVal)
      },
      deep: true
    }
  },
  methods: {
    addLink() {
      if (this.link) {
        this.local.personal.links.push(this.link)
        this.link = ''
      }
    },
    removeLink(index) {
      this.local.personal.links.splice(index, 1)
    },
    addSkill() {
      if (this.skill) {
        this.local.skills.push(this.skill)
        this.skill = ''
      }
    },
    removeSkill(index) {
      this.local.skills.splice(index, 1)
    },
    addLang() {
      if (this.lang.name) {
        this.local.languages.push({ ...this.lang })
        this.lang = { name: '', proficiency: 100 }
      }
    },
    removeLang(index) {
      this.local.languages.splice(index, 1)
    },
    addExp() {
      if (this.exp.title) {
        this.local.experiences.push({ ...this.exp })
        this.exp = { title: '', company: '', period: '', description: '' }
      }
    },
    removeExp(index) {
      this.local.experiences.splice(index, 1)
    },
    addEdu() {
      if (this.edu.degree) {
        this.local.education.push({ ...this.edu })
        this.edu = { degree: '', period: '', mark: '', thesis: '' }
      }
    },
    removeEdu(index) {
      this.local.education.splice(index, 1)
    }
  }
}
</script>
