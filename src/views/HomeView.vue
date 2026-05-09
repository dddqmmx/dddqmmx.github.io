<script setup lang="ts">
import { computed, ref } from 'vue'

type SnapPage = {
  locked: boolean
}

const snapWrap = ref<HTMLElement | null>(null)
const currentIndex = ref(0)
const snapPages = ref<SnapPage[]>([
  { locked: false },
  { locked: false },
  { locked: false },
])

const currentPage = computed(() => snapPages.value[currentIndex.value])

let isSnapping = false
let touchStartY = 0

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
  window.setTimeout(() => {
    isSnapping = false
  }, 520)
}

function requestSnap(direction: 1 | -1, event?: Event) {
  event?.preventDefault()

  if (isSnapping || currentPage.value?.locked) {
    return
  }

  const targetIndex = Math.min(Math.max(currentIndex.value + direction, 0), snapPages.value.length - 1)
  snapTo(targetIndex)
}

function handleWheel(event: WheelEvent) {
  if (Math.abs(event.deltaY) < 10) {
    return
  }

  requestSnap(event.deltaY > 0 ? 1 : -1, event)
}

function handleTouchStart(event: TouchEvent) {
  touchStartY = event.touches[0]?.clientY ?? 0
}

function handleTouchMove(event: TouchEvent) {
  const touchY = event.touches[0]?.clientY ?? touchStartY
  const deltaY = touchStartY - touchY

  if (Math.abs(deltaY) < 32) {
    return
  }

  requestSnap(deltaY > 0 ? 1 : -1, event)
  touchStartY = touchY
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
</script>

<style scoped>
#snapWrap {
  height: 100vh;
  overflow-y: auto;
  scroll-snap-type: y mandatory;
  overscroll-behavior-y: contain;
  scrollbar-width: none;
}

#snapWrap::-webkit-scrollbar {
  display: none;
}

#visual {
  height: 100svh;
}

#visual {
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
  height: 100svh;
  scroll-snap-align: start;
  scroll-snap-stop: always;
}

.sectionTitle {
  font-size: clamp(3rem, 8vw, 8rem);
  font-weight: 900;
  line-height: 1;
}
</style>

<template>
  <div
    id="snapWrap"
    ref="snapWrap"
    tabindex="0"
    @keydown="handleKeydown"
    @scroll="handleScroll"
    @touchmove="handleTouchMove"
    @touchstart="handleTouchStart"
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
