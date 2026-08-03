<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, onBeforeUnmount, onMounted } from 'vue'
import { useLocaleStore } from '@/stores/locale'
import { sectionOrder, useSectionStore, type SectionId } from '@/stores/section'

type ContactMeta = {
  label: string
  value: string
  href: string
  external?: boolean
}

const localeStore = useLocaleStore()
const sectionStore = useSectionStore()
const { t } = storeToRefs(localeStore)

const aboutMeta = {
  name: 'PaulPerkenstein',
  handle: 'dddqmmx',
  profileUrl: 'https://github.com/dddqmmx',
}

const techItems = {
  languages: ['Rust', 'Java', 'Python', 'TypeScript', 'Vue', 'C++'],
  domains: ['Android / Xposed', 'Linux Desktop', 'Privacy', 'Audio / AI', 'Networking'],
  focus: ['System Modules', 'Desktop Clients', 'CLI Tools', 'Open Source'],
}

const contactMeta: ContactMeta[] = [
  {
    label: 'GitHub',
    value: '@dddqmmx',
    href: 'https://github.com/dddqmmx',
    external: true,
  },
  {
    label: 'Email',
    value: 'dddqmmx@gmail.com',
    href: 'mailto:dddqmmx@gmail.com',
  },
]

const techGroups = computed(() => [
  { title: t.value.stack.groups.languages, items: techItems.languages },
  { title: t.value.stack.groups.domains, items: techItems.domains },
  { title: t.value.stack.groups.focus, items: techItems.focus },
])

const contacts = computed(() => contactMeta)

let observer: IntersectionObserver | null = null

// While a nav jump is animating, ignore intermediate sections passing through the
// observer band so the active indicator moves cleanly to the target.
let navTarget: SectionId | null = null
let navTargetTimer: ReturnType<typeof setTimeout> | null = null

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function clearNavTarget() {
  navTarget = null
  if (navTargetTimer) {
    clearTimeout(navTargetTimer)
    navTargetTimer = null
  }
}

function getSection(id: SectionId) {
  return document.getElementById(id)
}

function scrollToSection(section: SectionId) {
  const el = getSection(section)
  if (!el) return
  navTarget = section
  sectionStore.setActiveSection(section)
  if (navTargetTimer) clearTimeout(navTargetTimer)
  // Fallback release in case the target never settles in the observer band.
  navTargetTimer = setTimeout(clearNavTarget, 900)
  el.scrollIntoView({
    behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    block: 'start',
  })
}

function handleNavGoTo(event: Event) {
  const custom = event as CustomEvent<SectionId>
  if (custom.detail) {
    scrollToSection(custom.detail)
  }
}

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        const id = entry.target.id as SectionId
        if (!sectionOrder.includes(id)) continue
        if (navTarget) {
          // Hold the active state on the target until it reaches the band.
          if (id === navTarget) {
            clearNavTarget()
            sectionStore.setActiveSection(id)
          }
          continue
        }
        sectionStore.setActiveSection(id)
      }
    },
    // A section becomes active once it occupies the middle band of the viewport.
    { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
  )

  sectionOrder.forEach((id) => {
    const el = getSection(id)
    if (el) {
      observer?.observe(el)
    }
  })

  window.addEventListener('nav-go-to', handleNavGoTo)

  const hash = window.location.hash.replace('#', '') as SectionId
  if (sectionOrder.includes(hash) && hash !== 'home') {
    // Wait a frame so layout is settled before scrolling to the hashed section.
    requestAnimationFrame(() => scrollToSection(hash))
  }
})

onBeforeUnmount(() => {
  observer?.disconnect()
  window.removeEventListener('nav-go-to', handleNavGoTo)
  clearNavTarget()
})
</script>

<template>
  <div class="homePage">
    <!-- HERO -->
    <header id="home" class="hero">
      <div class="heroInner">
        <p class="heroKicker">{{ t.hero.tagline }}</p>
        <h1 class="heroTitle">
          <span>PAUL</span>
          <span>PERKEN</span>
          <span>STEIN</span>
        </h1>
        <p class="heroSub">{{ t.hero.sub }}</p>
      </div>
      <a class="scrollCue" href="#about" @click.prevent="scrollToSection('about')">
        <span class="scrollCueLabel">SCROLL</span>
        <span class="scrollCueLine" aria-hidden="true"></span>
      </a>
    </header>

    <!-- ABOUT -->
    <section id="about" class="homeSection sectionPanel">
      <div class="section">
        <p class="sectionLabel">ABOUT</p>
        <header class="sectionHeader">
          <h2 class="sectionTitle">{{ t.about.title }}</h2>
          <p class="sectionLead">{{ t.about.lead }}</p>
        </header>

        <div class="aboutGrid">
          <article class="aboutCard">
            <h3 class="aboutName">{{ aboutMeta.name }}</h3>
            <p class="aboutRole">{{ t.about.role }} · @{{ aboutMeta.handle }}</p>
            <p class="aboutSummary">{{ t.about.summary }}</p>
            <p class="aboutLanguages">
              {{ t.about.languagesLabel }} · {{ t.about.languages.join(' / ') }}
            </p>
            <a
              class="profileLink"
              :href="aboutMeta.profileUrl"
              target="_blank"
              rel="noopener noreferrer"
            >
              {{ t.about.profileLink }}
            </a>
          </article>

          <ul class="highlightList">
            <li v-for="item in t.about.highlights" :key="item">{{ item }}</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- STACK -->
    <section id="stack" class="homeSection sectionBase">
      <div class="section">
        <p class="sectionLabel">STACK</p>
        <header class="sectionHeader">
          <h2 class="sectionTitle">{{ t.stack.title }}</h2>
          <p class="sectionLead">{{ t.stack.lead }}</p>
        </header>

        <div class="techGrid">
          <article v-for="group in techGroups" :key="group.title" class="techCard">
            <h3 class="techTitle">{{ group.title }}</h3>
            <ul class="techList">
              <li v-for="item in group.items" :key="item">{{ item }}</li>
            </ul>
          </article>
        </div>
      </div>
    </section>

    <!-- CONTACT -->
    <footer id="contact" class="homeSection sectionPanel">
      <div class="section">
        <p class="sectionLabel">CONTACT</p>
        <header class="sectionHeader">
          <h2 class="sectionTitle">{{ t.contact.title }}</h2>
          <p class="sectionLead">{{ t.contact.lead }}</p>
        </header>

        <div class="contactGrid">
          <a
            v-for="item in contacts"
            :key="item.label"
            class="contactCard"
            :href="item.href"
            :target="item.external ? '_blank' : undefined"
            :rel="item.external ? 'noopener noreferrer' : undefined"
          >
            <span class="contactLabel">{{ item.label }}</span>
            <span class="contactValue">{{ item.value }}</span>
            <span class="contactAction">{{ t.contact.open }}</span>
          </a>
        </div>

        <p class="footerMeta">© {{ new Date().getFullYear() }} PaulPerkenstein · @dddqmmx</p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.homePage {
  width: 100%;
}

.homeSection {
  position: relative;
  scroll-margin-top: var(--nav-h-home);
}

.sectionBase {
  background: var(--color-bg-base);
}

.sectionPanel {
  background: var(--color-bg-panel);
}

/* ---------- HERO ---------- */
.hero {
  position: relative;
  display: flex;
  align-items: center;
  min-height: 100svh;
  background:
    linear-gradient(90deg, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0.2) 45%, rgba(0, 0, 0, 0) 70%),
    url('@/assets/visual_character.png') no-repeat right 0 / auto 100%,
    url('@/assets/visual_bg.webp') no-repeat center / cover;
}

.heroInner {
  margin-left: max(4vw, calc((100% - 1120px) / 2));
  padding-right: 2rem;
}

.heroKicker {
  margin-bottom: 1.2rem;
  font-family: var(--ff-en);
  font-size: clamp(0.85rem, 1.5vw, 1.1rem);
  font-weight: var(--fw-bo);
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: var(--color-gold);
}

.heroTitle {
  font-family: var(--ff-an);
  font-size: clamp(4.5rem, 12vw, 12rem);
  line-height: 0.86;
  color: #ffffff;
  text-shadow: 0 0 2rem rgba(0, 0, 0, 0.6);
}

.heroTitle span {
  display: block;
  opacity: 0;
  animation: titleReveal 0.5s ease forwards;
}

.heroTitle span:nth-child(1) {
  animation-delay: 0.15s;
}

.heroTitle span:nth-child(2) {
  animation-delay: 0.3s;
}

.heroTitle span:nth-child(3) {
  animation-delay: 0.45s;
}

@keyframes titleReveal {
  from {
    opacity: 0;
    transform: translateY(0.4em);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.heroSub {
  margin-top: 1.6rem;
  max-width: 30rem;
  font-size: clamp(1rem, 1.6vw, 1.25rem);
  line-height: 1.6;
  color: var(--color-f-dim);
  opacity: 0;
  animation: titleReveal 0.6s ease 0.7s forwards;
}

.scrollCue {
  position: absolute;
  left: 50%;
  bottom: 2.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.6rem;
  transform: translateX(-50%);
}

.scrollCueLabel {
  font-family: var(--ff-en);
  font-size: 0.7rem;
  font-weight: var(--fw-bo);
  letter-spacing: 0.24em;
  color: var(--color-f-faint);
}

.scrollCueLine {
  width: 1px;
  height: 3rem;
  background: linear-gradient(180deg, var(--color-gold), transparent);
  animation: cuePulse 1.8s ease-in-out infinite;
}

@keyframes cuePulse {
  0%,
  100% {
    opacity: 0.3;
    transform: scaleY(0.7);
    transform-origin: top;
  }
  50% {
    opacity: 1;
    transform: scaleY(1);
    transform-origin: top;
  }
}

/* ---------- SECTION SHELL ---------- */
.section {
  width: min(1120px, 92vw);
  margin: 0 auto;
  padding: clamp(6rem, 12vh, 9rem) 0 clamp(4rem, 8vh, 6rem);
}

.sectionLabel {
  margin-left: calc(-1 * max(4vw, calc((100vw - 1120px) / 2)));
  margin-bottom: clamp(1.5rem, 3vw, 2.5rem);
  /* Bleed the box to the viewport edge, but start the text at the content column. */
  padding-left: max(4vw, calc((100vw - 1120px) / 2));
}

.sectionHeader {
  margin-bottom: clamp(2rem, 4vw, 3.5rem);
}

.sectionTitle {
  font-family: var(--ff-an);
  font-size: clamp(2.4rem, 6vw, 4.5rem);
  line-height: 1;
  letter-spacing: 0.01em;
}

.sectionLead {
  max-width: 42rem;
  margin-top: 1rem;
  font-size: clamp(1rem, 1.5vw, 1.15rem);
  line-height: 1.7;
  color: var(--color-f-dim);
}

/* ---------- ABOUT ---------- */
.aboutGrid {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: clamp(1.5rem, 4vw, 3rem);
  align-items: start;
}

.aboutCard {
  padding: clamp(1.5rem, 3vw, 2.25rem);
  border: 1px solid var(--color-line);
  background: rgba(255, 255, 255, 0.02);
}

.aboutName {
  font-family: var(--ff-en);
  font-size: clamp(1.8rem, 4vw, 2.6rem);
  font-weight: var(--fw-bo);
  line-height: 1.1;
}

.aboutRole {
  margin-top: 0.5rem;
  font-family: var(--ff-en);
  font-size: 0.95rem;
  font-weight: var(--fw-bo);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-gold);
}

.aboutSummary {
  margin-top: 1.3rem;
  font-size: 1.05rem;
  line-height: 1.8;
  color: rgba(255, 255, 255, 0.86);
}

.aboutLanguages {
  margin-top: 0.9rem;
  font-size: 0.95rem;
  line-height: 1.6;
  color: var(--color-f-faint);
}

.profileLink {
  display: inline-block;
  margin-top: 1.4rem;
  font-family: var(--ff-en);
  font-size: 0.9rem;
  font-weight: var(--fw-bo);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-orange-bright);
  transition: color 0.2s ease;
}

.profileLink:hover {
  color: var(--color-gold);
}

.highlightList {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.highlightList li {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 1.1rem 1.2rem;
  border: 1px solid var(--color-line);
  font-weight: var(--fw-me);
}

.highlightList li::before {
  content: '';
  width: 0.65rem;
  height: 0.65rem;
  flex-shrink: 0;
  background: var(--color-orange);
}

/* ---------- STACK ---------- */
.techGrid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
}

.techCard {
  padding: 1.5rem;
  border: 1px solid var(--color-line);
  background: rgba(255, 255, 255, 0.02);
}

.techTitle {
  margin-bottom: 1.2rem;
  font-family: var(--ff-en);
  font-size: 1.1rem;
  font-weight: var(--fw-bo);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--color-gold);
}

.techList {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.techList li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding-bottom: 0.6rem;
  border-bottom: 1px solid var(--color-line);
  font-weight: var(--fw-me);
}

.techList li::after {
  content: '';
  width: 1.5rem;
  height: 2px;
  background: var(--color-orange);
}

/* ---------- CONTACT ---------- */
.contactGrid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.contactCard {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  padding: 1.5rem;
  border: 1px solid var(--color-line);
  background: rgba(255, 255, 255, 0.02);
  transition: transform 0.2s ease, border-color 0.2s ease, background-color 0.2s ease;
}

.contactCard:hover {
  transform: translateY(-4px);
  border-color: var(--color-orange);
  background: rgba(189, 67, 0, 0.08);
}

.contactLabel {
  font-family: var(--ff-en);
  font-size: 0.8rem;
  font-weight: var(--fw-bo);
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--color-gold);
}

.contactValue {
  font-size: clamp(1.15rem, 2.4vw, 1.45rem);
  font-weight: var(--fw-bo);
  line-height: 1.25;
  overflow-wrap: anywhere;
}

.contactAction {
  margin-top: auto;
  padding-top: 0.8rem;
  font-family: var(--ff-en);
  font-size: 0.85rem;
  font-weight: var(--fw-bo);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-f-dim);
}

.footerMeta {
  margin-top: 3rem;
  font-family: var(--ff-en);
  font-size: 0.85rem;
  letter-spacing: 0.08em;
  color: var(--color-f-faint);
  text-align: center;
}

/* ---------- RESPONSIVE ---------- */
@media (max-width: 900px) {
  .aboutGrid,
  .techGrid,
  .contactGrid {
    grid-template-columns: 1fr;
  }
}

/* The nav sits at the bottom in portrait, so sections align to the top edge
   and leave room below for the fixed bottom nav instead of the top header. */
@media screen and (max-width: 1279px) and (orientation: portrait),
  screen and (max-width: 899px) {
  .homeSection {
    scroll-margin-top: 0;
    scroll-margin-bottom: calc(var(--nav-tier1-h) + var(--nav-tier2-h));
  }
}

@media (prefers-reduced-motion: reduce) {
  .heroTitle span,
  .heroSub {
    animation: none;
    opacity: 1;
    transform: none;
  }

  .scrollCueLine {
    animation: none;
  }
}

@media (max-width: 560px) {
  .hero {
    align-items: flex-end;
    padding-bottom: 12vh;
    background:
      linear-gradient(0deg, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.1) 55%),
      url('@/assets/visual_character.png') no-repeat 62% 0 / auto 100%,
      url('@/assets/visual_bg.webp') no-repeat center / cover;
  }

  .heroInner {
    margin-left: 6vw;
  }

  .scrollCue {
    display: none;
  }
}
</style>
