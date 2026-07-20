<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { RouterView, useRoute, useRouter } from 'vue-router'
import { localeOptions, type Locale } from '@/i18n/messages'
import { useLocaleStore } from '@/stores/locale'
import { useSectionStore, type SectionId } from '@/stores/section'

const localeStore = useLocaleStore()
const sectionStore = useSectionStore()
const route = useRoute()
const router = useRouter()
const { locale, t } = storeToRefs(localeStore)
const { activeSection } = storeToRefs(sectionStore)

const navItems: { id: SectionId; label: () => string }[] = [
  { id: 'home', label: () => t.value.nav.home },
  { id: 'about', label: () => t.value.nav.about },
  { id: 'project', label: () => t.value.nav.project },
  { id: 'stack', label: () => t.value.nav.stack },
  { id: 'contact', label: () => t.value.nav.contact },
]

function setLocale(next: Locale) {
  localeStore.setLocale(next)
}

function goToSection(section: SectionId, event: Event) {
  event.preventDefault()

  if (route.path !== '/') {
    void router.push({ path: '/', hash: section === 'home' ? '' : `#${section}` }).then(() => {
      window.dispatchEvent(new CustomEvent<SectionId>('nav-go-to', { detail: section }))
    })
    return
  }

  sectionStore.setActiveSection(section)
  window.dispatchEvent(new CustomEvent<SectionId>('nav-go-to', { detail: section }))
}
</script>

<template>
  <header class="siteNav">
    <nav class="navLinks" :aria-label="t.nav.home">
      <a
        v-for="item in navItems"
        :key="item.id"
        :href="item.id === 'home' ? '/' : `#${item.id}`"
        :class="{ active: activeSection === item.id }"
        :aria-current="activeSection === item.id ? 'page' : undefined"
        @click="goToSection(item.id, $event)"
      >
        {{ item.label() }}
      </a>
    </nav>

    <div class="languageSelect" role="group" :aria-label="t.nav.language">
      <span>{{ t.nav.language }}</span>
      <button
        v-for="item in localeOptions"
        :key="item.value"
        type="button"
        class="langBtn"
        :class="{ active: locale === item.value }"
        :aria-pressed="locale === item.value"
        @click="setLocale(item.value)"
      >
        {{ item.label }}
      </button>
    </div>
  </header>

  <RouterView />
</template>

<style scoped>
.siteNav {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  min-height: 64px;
  padding: 0 3vw;
  background: #000000;
  color: #ffffff;
  pointer-events: auto;
}

.navLinks {
  display: flex;
  align-items: center;
  gap: clamp(1.5rem, 4vw, 4rem);
}

.navLinks a,
.languageSelect {
  font-size: clamp(1rem, 1.5vw, 1.45rem);
  font-weight: 800;
  letter-spacing: 0.08em;
}

.navLinks a.active,
.navLinks a[aria-current='page'] {
  color: #bd4300;
}

.languageSelect {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  flex-shrink: 0;
  position: relative;
  z-index: 1001;
}

.langBtn {
  border: 2px solid #ffffff;
  border-radius: 0;
  padding: 0.35rem 0.65rem;
  background: #000000;
  color: #ffffff;
  font: inherit;
  font-size: 0.85em;
  letter-spacing: 0.04em;
  cursor: pointer;
}

.langBtn:hover {
  background: #222222;
}

.langBtn.active {
  background: #bd4300;
  border-color: #bd4300;
  color: #ffffff;
}

@media screen and (max-width: 1279px) and (orientation: portrait) {
  .siteNav {
    min-height: 56px;
    padding: 0 4vw;
  }

  .navLinks {
    gap: clamp(0.8rem, 4vw, 1.5rem);
  }

  .navLinks a,
  .languageSelect {
    font-size: clamp(0.78rem, 3.4vw, 0.95rem);
    letter-spacing: 0.04em;
  }

  .languageSelect span {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
  }

  .langBtn {
    padding: 0.28rem 0.42rem;
  }
}
</style>
