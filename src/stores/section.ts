import { ref } from 'vue'
import { defineStore } from 'pinia'

export type SectionId = 'home' | 'about' | 'stack' | 'contact'

export const sectionOrder: SectionId[] = ['home', 'about', 'stack', 'contact']

export const useSectionStore = defineStore('section', () => {
  const activeSection = ref<SectionId>('home')

  function setActiveSection(section: SectionId) {
    activeSection.value = section
  }

  return {
    activeSection,
    setActiveSection,
  }
})
