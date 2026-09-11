import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { sectionOrder, useSectionStore } from '@/stores/section'

describe('section store', () => {
  beforeEach(() => setActivePinia(createPinia()))

  it('starts on home', () => {
    expect(useSectionStore().activeSection).toBe('home')
  })

  it('setActiveSection updates the active section', () => {
    const store = useSectionStore()
    store.setActiveSection('stack')
    expect(store.activeSection).toBe('stack')
  })

  it('covers exactly the home page sections', () => {
    expect(sectionOrder).toEqual(['home', 'about', 'stack', 'contact'])
  })
})
