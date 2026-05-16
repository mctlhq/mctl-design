<script setup lang="ts">
withDefaults(
  defineProps<{
    code: string;
    /** Language hint shown in the caption, e.g. 'bash', 'json', 'go'. */
    lang?: string;
    /** Optional filename shown above the block. */
    filename?: string;
  }>(),
  { lang: '', filename: '' },
);
</script>

<template>
  <figure class="m-code-block">
    <figcaption v-if="filename || lang" class="m-code-block__caption">
      <span v-if="filename" class="m-code-block__filename">{{ filename }}</span>
      <span v-if="lang" class="m-code-block__lang">{{ lang }}</span>
    </figcaption>
    <pre class="m-code-block__pre"><code class="m-code-block__code">{{ code }}</code></pre>
  </figure>
</template>

<style scoped>
.m-code-block {
  margin: 0;
  background: var(--surface-card);
  border: 1px solid var(--surface-line);
  border-radius: var(--mctl-radius-md);
  overflow: hidden;
}

.m-code-block__caption {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--mctl-space-3);
  padding: var(--mctl-space-2) var(--mctl-space-4);
  border-bottom: 1px solid var(--surface-line);
  font-family: var(--font-mono);
  font-size: var(--mctl-typography-font-size-marker);
}

.m-code-block__filename {
  color: var(--surface-fg-muted);
}

.m-code-block__lang {
  letter-spacing: var(--mctl-typography-letter-spacing-marker);
  text-transform: uppercase;
  color: var(--surface-fg-subtle);
  margin-left: auto;
}

.m-code-block__pre {
  margin: 0;
  padding: var(--mctl-space-4);
  overflow-x: auto;
  font-family: var(--font-mono);
  font-size: var(--mctl-typography-font-size-marker);
  line-height: 1.7;
}

.m-code-block__code {
  color: var(--syntax-string);
  font-family: inherit;
  white-space: pre;
}
</style>
