<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { ProjectKey } from '@/i18n/messages'
import { useLocaleStore } from '@/stores/locale'
import { sectionOrder, useSectionStore, type SectionId } from '@/stores/section'

type SnapPage = {
  locked: boolean
}

type ProjectMeta = {
  key: ProjectKey
  name: string
  tags: string[]
  href: string
}

type ContactMeta = {
  label: string
  valueKey?: 'issues'
  value?: string
  href: string
  external?: boolean
}

const localeStore = useLocaleStore()
const sectionStore = useSectionStore()
const { t } = storeToRefs(localeStore)

const snapWrap = ref<HTMLElement | null>(null)
const currentIndex = ref(0)
const isPcLayout = ref(true)
const snapPages = ref<SnapPage[]>([
  { locked: false },
  { locked: false },
  { locked: false },
  { locked: false },
  { locked: false },
])

const aboutMeta = {
  name: 'PaulPerkenstein',
  handle: 'dddqmmx',
  profileUrl: 'https://github.com/dddqmmx',
}

const projectMeta: ProjectMeta[] = [
  {
    key: 'arirang',
    name: 'arirang',
    tags: ['C++', 'Xposed', 'Android'],
    href: 'https://github.com/dddqmmx/arirang',
  },
  {
    key: 'ncmDesktop',
    name: 'ncm-desktop-for-linux',
    tags: ['Rust', 'Linux', 'Desktop'],
    href: 'https://github.com/dddqmmx/ncm-desktop-for-linux',
  },
  {
    key: 'xminecraft',
    name: 'xminecraft',
    tags: ['Rust', 'Proxy', 'Network'],
    href: 'https://github.com/dddqmmx/xminecraft',
  },
  {
    key: 'soVits',
    name: 'so-vits-svc-cover',
    tags: ['Java', 'AI', 'Mirai'],
    href: 'https://github.com/dddqmmx/so-vits-svc-cover',
  },
  {
    key: 'uvr5',
    name: 'uvr5-cli',
    tags: ['Python', 'CLI', 'Audio'],
    href: 'https://github.com/dddqmmx/uvr5-cli',
  },
  {
    key: 'fuckClipboard',
    name: 'FuckClipboard',
    tags: ['Java', 'Xposed', 'Android'],
    href: 'https://github.com/dddqmmx/FuckClipboard',
  },
]

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

const projects = computed(() =>
  projectMeta.map((project) => ({
    ...project,
    description: t.value.project.items[project.key],
  })),
)

const techGroups = computed(() => [
  {
    title: t.value.stack.groups.languages,
    items: techItems.languages,
  },
  {
    title: t.value.stack.groups.domains,
    items: techItems.domains,
  },
  {
    title: t.value.stack.groups.focus,
    items: techItems.focus,
  },
])

const contacts = computed(() =>
  contactMeta.map((item) => ({
    label: item.label,
    href: item.href,
    external: item.external,
    value: item.valueKey === 'issues' ? t.value.contact.issues : (item.value ?? ''),
  })),
)

const currentPage = computed(() => snapPages.value[currentIndex.value])

let isSnapping = false
let snapTimer = 0
let layoutQuery: MediaQueryList | null = null

function getSnapItems() {
  return Array.from(snapWrap.value?.querySelectorAll<HTMLElement>('.snapItem') ?? [])
}

function getNearestSnapIndex() {
  const wrap = snapWrap.value

  if (!wrap) {
    return 0
  }

  return getSnapItems().reduce(
    (nearest, item, index) => {
      const distance = Math.abs(item.offsetTop - wrap.scrollTop)

      return distance < nearest.distance ? { index, distance } : nearest
    },
    { index: 0, distance: Number.POSITIVE_INFINITY },
  ).index
}

function snapTo(index: number) {
  const items = getSnapItems()
  const target = items[index]

  if (!target) {
    return
  }

  if (index === currentIndex.value) {
    sectionStore.setActiveByIndex(index)
    return
  }

  isSnapping = true
  currentIndex.value = index
  sectionStore.setActiveByIndex(index)
  target.scrollIntoView({ block: 'start', behavior: 'smooth' })
  window.clearTimeout(snapTimer)
  snapTimer = window.setTimeout(() => {
    isSnapping = false
  }, 520)
}

function snapToSection(section: SectionId) {
  const index = sectionOrder.indexOf(section)
  if (index < 0) {
    return
  }
  snapTo(index)
}

function requestSnap(direction: 1 | -1, event?: Event) {
  if (!isPcLayout.value || isSnapping || currentPage.value?.locked) {
    return
  }

  event?.preventDefault()

  const targetIndex = Math.min(Math.max(currentIndex.value + direction, 0), snapPages.value.length - 1)
  snapTo(targetIndex)
}

function handleWheel(event: WheelEvent) {
  if (Math.abs(event.deltaY) < 10) {
    return
  }

  requestSnap(event.deltaY > 0 ? 1 : -1, event)
}

function handleKeydown(event: KeyboardEvent) {
  const nextKeys = ['ArrowDown', 'PageDown', ' ']
  const previousKeys = ['ArrowUp', 'PageUp']

  if (nextKeys.includes(event.key)) {
    requestSnap(1, event)
  }

  if (previousKeys.includes(event.key)) {
    requestSnap(-1, event)
  }
}

function handleScroll() {
  if (isSnapping) {
    return
  }

  const nextIndex = getNearestSnapIndex()

  if (currentPage.value?.locked && nextIndex !== currentIndex.value) {
    snapTo(currentIndex.value)
    return
  }

  currentIndex.value = nextIndex
  sectionStore.setActiveByIndex(nextIndex)
}

function isSnapLocked(index: number) {
  return snapPages.value[index]?.locked ?? false
}

function updateLayoutFlags(event: MediaQueryList | MediaQueryListEvent) {
  isPcLayout.value = event.matches
  isSnapping = false
}

function handleNavGoTo(event: Event) {
  const custom = event as CustomEvent<SectionId>
  const section = custom.detail
  if (!section) {
    return
  }
  snapToSection(section)
}

watch(currentIndex, (index) => {
  sectionStore.setActiveByIndex(index)
})

onMounted(() => {
  layoutQuery = window.matchMedia(
    'screen and (min-width: 1280px), (max-width: 1279px) and (orientation: landscape)',
  )
  updateLayoutFlags(layoutQuery)
  layoutQuery.addEventListener('change', updateLayoutFlags)
  window.addEventListener('nav-go-to', handleNavGoTo)

  const hash = window.location.hash.replace('#', '') as SectionId
  if (sectionOrder.includes(hash)) {
    snapToSection(hash)
  } else {
    sectionStore.setActiveByIndex(currentIndex.value)
  }
})

onBeforeUnmount(() => {
  window.clearTimeout(snapTimer)
  layoutQuery?.removeEventListener('change', updateLayoutFlags)
  window.removeEventListener('nav-go-to', handleNavGoTo)
})
</script>

<style scoped>
#snapWrap {
  width: 100%;
  height: 100svh;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  scroll-snap-type: y mandatory;
  scroll-behavior: smooth;
  overscroll-behavior-y: contain;
  scrollbar-width: none;
  container-type: inline-size;
}

#snapWrap::-webkit-scrollbar {
  display: none;
}

#home {
  height: 100dvh;
  display: flex;
  align-items: center;
  background:
    url('@/assets/visual_character.png') no-repeat right 0 / auto 100%,
    url('@/assets/visual_bg.webp') no-repeat center / cover;
}

.visualTitle {
  margin-left: 3vw;
  font-size: clamp(5rem, 12vw, 12rem);
  font-weight: 900;
  line-height: 0.9;
  color: #ffffff;
  -webkit-text-stroke: 0.03em #ffffff;
}

.visualTitle span {
  display: block;
  opacity: 0;
  animation: titleReveal 0.08s steps(1, end) forwards;
}

.visualTitle span:last-child {
  animation-delay: 1.2s;
}

.visualTitle span:nth-child(2) {
  animation-delay: 1.1s;
}

.visualTitle span:first-child {
  animation-delay: 1s;
}

@keyframes titleReveal {
  to {
    opacity: 1;
  }
}

.snapItem {
  position: relative;
  display: grid;
  place-items: center;
  width: 100%;
  height: 100dvh;
  scroll-snap-align: start;
  scroll-snap-stop: always;
}

.section {
  width: min(1120px, 92vw);
  padding: 6rem 0 3rem;
  color: #111111;
}

.sectionPanel {
  background: #f6f6f6;
  color: #111111;
}

.sectionDark {
  background: #111111;
  color: #ffffff;
}

.sectionDark .section {
  color: #ffffff;
}

.sectionDark .sectionLead {
  color: rgba(255, 255, 255, 0.82);
}

.sectionDark .techCard {
  border-color: rgba(255, 255, 255, 0.88);
  color: #ffffff;
}

.sectionDark .techList li {
  color: #ffffff;
  border-bottom-color: rgba(255, 255, 255, 0.22);
}

.sectionHeader {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  margin-bottom: clamp(1.5rem, 3vw, 2.5rem);
}

.sectionKicker {
  font-size: 0.85rem;
  font-weight: 800;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #bd4300;
}

.sectionTitle {
  font-size: clamp(2.4rem, 6vw, 4.5rem);
  font-weight: 900;
  line-height: 1;
}

.sectionLead {
  max-width: 42rem;
  font-size: clamp(1rem, 1.5vw, 1.15rem);
  line-height: 1.7;
  opacity: 0.85;
}

.aboutGrid {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: clamp(1.5rem, 4vw, 3rem);
  align-items: start;
}

.aboutCard,
.techCard {
  border: 2px solid currentColor;
  background: transparent;
}

.aboutCard {
  padding: clamp(1.25rem, 3vw, 2rem);
}

.aboutName {
  font-size: clamp(1.8rem, 4vw, 2.6rem);
  font-weight: 900;
  line-height: 1.1;
}

.aboutRole {
  margin-top: 0.4rem;
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #bd4300;
}

.aboutSummary {
  margin-top: 1.2rem;
  font-size: 1.05rem;
  line-height: 1.75;
}

.aboutLanguages {
  margin-top: 0.85rem;
  font-size: 0.95rem;
  line-height: 1.6;
  opacity: 0.72;
}

.profileLink {
  display: inline-block;
  margin-top: 1.25rem;
  font-size: 0.9rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #bd4300;
}

.highlightList {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  list-style: none;
  padding: 0;
}

.highlightList li {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.1rem;
  border: 2px solid currentColor;
  font-weight: 700;
}

.highlightList li::before {
  content: '';
  width: 0.65rem;
  height: 0.65rem;
  background: #bd4300;
  flex-shrink: 0;
}

.projectGrid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
}

.projectCard {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  min-height: 100%;
  padding: 1.25rem;
  border: 2px solid #111111;
  background: #ffffff;
  color: #111111;
  transition:
    transform 0.2s ease,
    background-color 0.2s ease,
    color 0.2s ease,
    border-color 0.2s ease;
}

.projectCard:hover {
  transform: translateY(-4px);
  background: #111111;
  border-color: #111111;
  color: #ffffff;
}

.projectName {
  font-size: 1.35rem;
  font-weight: 900;
  line-height: 1.2;
  color: inherit;
}

.projectDesc {
  flex: 1;
  font-size: 0.98rem;
  line-height: 1.65;
  color: #333333;
}

.projectCard:hover .projectDesc {
  color: rgba(255, 255, 255, 0.9);
}

.tagRow {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
}

.tag {
  padding: 0.2rem 0.55rem;
  border: 1.5px solid #111111;
  color: #111111;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.04em;
}

.projectCard:hover .tag {
  border-color: #ffffff;
  color: #ffffff;
}

.projectLink {
  font-size: 0.9rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #bd4300;
}

.projectCard:hover .projectLink {
  color: #ff7a33;
}

.techGrid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
}

.techCard {
  padding: 1.25rem;
}

.techTitle {
  margin-bottom: 1rem;
  font-size: 1.2rem;
  font-weight: 900;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #bd4300;
}

.techList {
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  list-style: none;
  padding: 0;
}

.techList li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding-bottom: 0.55rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.18);
  font-weight: 700;
}

.techList li::after {
  content: '';
  width: 1.5rem;
  height: 2px;
  background: #bd4300;
}

.contactGrid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.contactCard {
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
  min-height: 100%;
  padding: 1.35rem 1.25rem;
  border: 2px solid currentColor;
  transition:
    transform 0.2s ease,
    background-color 0.2s ease,
    color 0.2s ease;
}

.contactCard:hover {
  transform: translateY(-4px);
  background: #111111;
  color: #ffffff;
}

.contactLabel {
  font-size: 0.8rem;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #bd4300;
}

.contactCard:hover .contactLabel {
  color: #ff7a33;
}

.contactValue {
  font-size: clamp(1.15rem, 2.4vw, 1.45rem);
  font-weight: 900;
  line-height: 1.25;
  overflow-wrap: anywhere;
}

.contactAction {
  margin-top: auto;
  padding-top: 0.8rem;
  font-size: 0.85rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  opacity: 0.75;
}

.footerMeta {
  margin-top: 2rem;
  font-size: 0.9rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  opacity: 0.65;
  text-align: center;
}

@media screen and (max-width: 1279px) and (orientation: portrait) {
  #snapWrap {
    scroll-snap-type: y mandatory;
    overscroll-behavior-y: auto;
  }

  #home {
    align-items: flex-start;
    padding: 18svh 4cqw 0;
    background:
      linear-gradient(0deg, rgba(0, 0, 0, 0.82) 0%, rgba(0, 0, 0, 0) 42%),
      url('@/assets/visual_character.png') no-repeat 62% 0 / auto 100%,
      url('@/assets/visual_bg.webp') no-repeat center / cover;
  }

  .visualTitle {
    margin-left: 0;
    font-size: clamp(4.25rem, 20cqw, 7.5rem);
    line-height: 0.86;
    text-shadow: 0 0 0.8rem rgba(0, 0, 0, 0.45);
  }

  .snapItem {
    min-height: 100dvh;
    height: auto;
    place-items: stretch;
  }

  .section {
    width: min(100%, 92vw);
    margin: 0 auto;
    padding: 5.5rem 0 2.5rem;
  }

  .aboutGrid,
  .projectGrid,
  .techGrid,
  .contactGrid {
    grid-template-columns: 1fr;
  }

  .sectionTitle {
    font-size: clamp(2.2rem, 12cqw, 3.4rem);
  }
}

@media (max-width: 1279px) and (orientation: landscape), screen and (min-width: 1280px) {
  #snapWrap {
    overscroll-behavior-y: contain;
  }
}

@media (max-width: 900px) {
  .aboutGrid,
  .projectGrid,
  .techGrid,
  .contactGrid {
    grid-template-columns: 1fr;
  }
}
</style>

<template>
  <div
    id="snapWrap"
    ref="snapWrap"
    tabindex="0"
    @keydown="handleKeydown"
    @scroll="handleScroll"
    @wheel="handleWheel"
  >
    <header id="home" class="snapItem" :data-locked="isSnapLocked(0)">
      <h1 class="visualTitle">
        <span>PAUL</span>
        <span>PERKEN</span>
        <span>STEIN</span>
      </h1>
    </header>

    <section id="about" class="snapItem sectionPanel" :data-locked="isSnapLocked(1)">
      <div class="section">
        <header class="sectionHeader">
          <p class="sectionKicker">{{ t.about.kicker }}</p>
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

    <section id="project" class="snapItem sectionPanel" :data-locked="isSnapLocked(2)">
      <div class="section">
        <header class="sectionHeader">
          <p class="sectionKicker">{{ t.project.kicker }}</p>
          <h2 class="sectionTitle">{{ t.project.title }}</h2>
          <p class="sectionLead">{{ t.project.lead }}</p>
        </header>

        <div class="projectGrid">
          <a
            v-for="project in projects"
            :key="project.name"
            class="projectCard"
            :href="project.href"
            target="_blank"
            rel="noopener noreferrer"
          >
            <h3 class="projectName">{{ project.name }}</h3>
            <p class="projectDesc">{{ project.description }}</p>
            <div class="tagRow">
              <span v-for="tag in project.tags" :key="tag" class="tag">{{ tag }}</span>
            </div>
            <span class="projectLink">{{ t.project.view }}</span>
          </a>
        </div>
      </div>
    </section>

    <section id="stack" class="snapItem sectionDark" :data-locked="isSnapLocked(3)">
      <div class="section">
        <header class="sectionHeader">
          <p class="sectionKicker">{{ t.stack.kicker }}</p>
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

    <footer id="contact" class="snapItem sectionPanel" :data-locked="isSnapLocked(4)">
      <div class="section">
        <header class="sectionHeader">
          <p class="sectionKicker">{{ t.contact.kicker }}</p>
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
      </div>
    </footer>
  </div>
</template>
