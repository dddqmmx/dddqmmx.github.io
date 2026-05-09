<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

type SnapPage = {
  locked: boolean
}

const snapWrap = ref<HTMLElement | null>(null)
const currentIndex = ref(0)
const isPcLayout = ref(true)
const snapPages = ref<SnapPage[]>([
  { locked: false },
  { locked: false },
  { locked: false },
])

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

  if (!target || index === currentIndex.value) {
    return
  }

  isSnapping = true
  currentIndex.value = index
  target.scrollIntoView({ block: 'start', behavior: 'smooth' })
  window.clearTimeout(snapTimer)
  snapTimer = window.setTimeout(() => {
    isSnapping = false
  }, 520)
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
}

function isSnapLocked(index: number) {
  return snapPages.value[index]?.locked ?? false
}

function updateLayoutFlags(event: MediaQueryList | MediaQueryListEvent) {
  isPcLayout.value = event.matches
  isSnapping = false
}

onMounted(() => {
  layoutQuery = window.matchMedia(
    'screen and (min-width: 1280px), (max-width: 1279px) and (orientation: landscape)',
  )
  updateLayoutFlags(layoutQuery)
  layoutQuery.addEventListener('change', updateLayoutFlags)
})

onBeforeUnmount(() => {
  window.clearTimeout(snapTimer)
  layoutQuery?.removeEventListener('change', updateLayoutFlags)
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

#visual {
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

.sectionTitle {
  font-size: clamp(3rem, 8vw, 8rem);
  font-weight: 900;
  line-height: 1;
}

@media screen and (max-width: 1279px) and (orientation: portrait) {
  #snapWrap {
    scroll-snap-type: y mandatory;
    overscroll-behavior-y: auto;
  }

  #visual {
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
  }

  .sectionTitle {
    font-size: clamp(3rem, 18cqw, 6rem);
  }
}

@media (max-width: 1279px) and (orientation: landscape), screen and (min-width: 1280px) {
  #snapWrap {
    overscroll-behavior-y: contain;
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
    <header id="visual" class="snapItem" :data-locked="isSnapLocked(0)">
      <h1 class="visualTitle">
        <span>PAUL</span>
        <span>PERKEN</span>
        <span>STEIN</span>
      </h1>
    </header>
    <main class="snapItem" :data-locked="isSnapLocked(1)">
      <h1 class="sectionTitle">HOME</h1>
    </main>
    <footer class="snapItem" :data-locked="isSnapLocked(2)">
      <h1 class="sectionTitle">FOOTER</h1>
    </footer>
  </div>
</template>
