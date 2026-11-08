<script lang="ts">
export interface MFooterProps {
  links?: Array<{ label: string; href: string }>;
  copyright?: string;
}
</script>

<script setup lang="ts">
withDefaults(defineProps<MFooterProps>(), { links: () => [], copyright: '' });
</script>

<template>
  <footer class="m-footer">
    <div class="m-footer__inner">
      <nav v-if="links.length" class="m-footer__links" aria-label="Footer navigation">
        <a v-for="link in links" :key="link.href" :href="link.href" class="m-footer__link">
          {{ link.label }}
        </a>
      </nav>
      <p v-if="copyright" class="m-footer__copy">{{ copyright }}</p>
    </div>
  </footer>
</template>

<style scoped>
/* Mirrors .mctl-site-footer (packages/css/src/site.css), so a Vue app using
   MFooter and a site on the plain classes render the same footer. */
.m-footer {
  box-sizing: border-box;
  padding-block: 48px;
  border-top: var(--mctl-border-width-hairline) solid var(--surface-line);
  background: color-mix(in srgb, var(--surface-elevated) 85%, transparent);
  font-family: var(--font-display);
  text-align: center;
}

.m-footer__inner {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  width: 100%;
  /* The same box as .mctl-site-container (the plain-class footer's inner div):
     content width plus both gutters, centred. */
  max-width: calc(var(--site-content-width) + 2 * var(--site-gutter));
  margin-inline: auto;
  padding-inline: var(--site-gutter);
}

.m-footer__links {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px 32px;
  font-size: var(--site-nav-size);
}

.m-footer__link {
  color: var(--surface-fg-muted);
  text-decoration: none;
  transition: color var(--mctl-motion-duration-fast) var(--mctl-motion-easing-standard);
}

.m-footer__link:hover {
  color: var(--surface-fg);
}

.m-footer__link:focus-visible {
  outline: var(--focus-ring-width) solid var(--focus-ring);
  outline-offset: var(--focus-ring-offset);
  color: var(--surface-fg);
}

.m-footer__copy {
  margin: 0;
  font-size: var(--text-caption-size);
  color: var(--surface-fg-muted);
}
</style>
