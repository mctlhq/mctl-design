<script setup lang="ts">
defineProps<{
  items: Array<{ label: string; href: string; active?: boolean }>;
}>();
</script>

<template>
  <nav class="m-nav">
    <ul class="m-nav__list" role="list">
      <li v-for="item in items" :key="item.href" class="m-nav__item">
        <a
          :href="item.href"
          class="m-nav__link"
          :class="{ 'm-nav__link--active': item.active }"
          :aria-current="item.active ? 'page' : undefined"
        >
          {{ item.label }}
        </a>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.m-nav {
  background: var(--surface-elevated);
  border-bottom: 1px solid var(--surface-line);
  font-family: var(--font-mono);
}

.m-nav__list {
  display: flex;
  align-items: center;
  gap: var(--mctl-space-1);
  list-style: none;
  margin: 0;
  padding: 0 var(--mctl-layout-page-padding);
  height: 48px;
}

.m-nav__item {
  display: flex;
  align-items: stretch;
}

.m-nav__link {
  display: flex;
  align-items: center;
  padding: 0 var(--mctl-space-3);
  font-size: var(--mctl-typography-font-size-body);
  color: var(--surface-fg-muted);
  text-decoration: none;
  border-bottom: 2px solid transparent;
  transition:
    color var(--mctl-motion-duration-fast) var(--mctl-motion-easing-standard),
    border-color var(--mctl-motion-duration-fast) var(--mctl-motion-easing-standard);
}

.m-nav__link:hover {
  color: var(--surface-fg);
}

.m-nav__link:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: -2px;
  color: var(--surface-fg);
}

.m-nav__link--active {
  color: var(--accent);
  border-bottom-color: var(--accent);
}
</style>
