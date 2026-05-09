<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header class="siteNav">
    <nav class="navLinks" aria-label="Primary navigation">
      <RouterLink to="/">HOME</RouterLink>
      <a href="#project">PROJECT</a>
      <a href="#blog">BLOG</a>
    </nav>

    <label class="languageSelect">
      <span>LANGUAGE</span>
      <select aria-label="Language">
        <option>EN</option>
        <option>ZH</option>
      </select>
    </label>
  </header>

  <RouterView />
</template>

<style scoped>
.siteNav {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  min-height: 64px;
  padding: 0 3vw;
  background: #000000;
  color: #ffffff;
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

.languageSelect {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.languageSelect select {
  border: 2px solid #ffffff;
  border-radius: 0;
  padding: 0.4rem 0.8rem;
  background: #000000;
  color: #ffffff;
  font: inherit;
}
</style>
