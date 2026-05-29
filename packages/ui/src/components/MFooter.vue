<script setup lang="ts">
withDefaults(
  defineProps<{
    links?: Array<{ label: string; href: string }>;
    copyright?: string;
  }>(),
  { links: () => [], copyright: '' },
);
</script>

<template>
  <footer class="m-footer">
    <div class="m-footer__inner">
      <nav v-if="links.length" class="m-footer__links" aria-label="Footer navigation">
        <a
          v-for="link in links"
          :key="link.href"
          :href="link.href"
          class="m-footer__link"
        >
          {{ link.label }}
        </a>
      </nav>
      <p v-if="copyright" class="m-footer__copy">{{ copyright }}</p>
    </div>
  </footer>
</template>

<style scoped>
.m-footer {
  border-top: 1px solid var(--surface-line);
  background: var(--surface-bg);
  font-family: var(--font-mono);
  font-size: var(--mctl-typography-font-size-marker);
  color: var(--surface-fg-subtle);
}

.m-footer__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--mctl-space-3);
  max-width: 960px;
  margin-inline: auto;
  padding: var(--mctl-space-4) var(--mctl-layout-page-padding);
}

.m-footer__links {
  display: flex;
  gap: var(--mctl-space-4);
  flex-wrap: wrap;
}

.m-footer__link {
  color: var(--surface-fg-subtle);
  text-decoration: none;
  transition: color var(--mctl-motion-duration-fast) var(--mctl-motion-easing-standard);
}

.m-footer__link:hover {
  color: var(--surface-fg-muted);
}

.m-footer__link:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
  color: var(--surface-fg-muted);
}

.m-footer__copy {
  margin: 0;
}
</style>
