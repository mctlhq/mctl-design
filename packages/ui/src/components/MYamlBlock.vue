<script lang="ts">
export interface MYamlBlockProps {
  /** Raw YAML source. */
  code: string;
  /** Optional file label shown above the block. */
  filename?: string;
}
</script>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useScrollFocus } from '../composables/useScrollFocus';

const props = withDefaults(defineProps<MYamlBlockProps>(), { filename: '' });

const preRef = ref<HTMLElement | null>(null);
const focusable = useScrollFocus(preRef);

type Kind = 'plain' | 'key' | 'string' | 'comment' | 'punct';
interface Segment {
  text: string;
  kind: Kind;
}

// Lightweight, presentation-only YAML colorizer — enough for spec/doc samples,
// not a full parser. Renders via text interpolation, never v-html.
function parseLine(line: string): Segment[] {
  if (line.trimStart().startsWith('#')) {
    // Never empty: it starts with '#'.
    return [{ text: line, kind: 'comment' }];
  }

  let main = line;
  let comment = '';
  const inlineComment = line.indexOf(' #');
  if (inlineComment !== -1) {
    main = line.slice(0, inlineComment);
    comment = line.slice(inlineComment);
  }

  const segments: Segment[] = [];
  const kv = main.match(/^(\s*-?\s*)([\w.\-/]+)(:)(.*)$/);
  if (kv) {
    const [, indent, key, colon, rest] = kv;
    segments.push({ text: indent, kind: 'plain' });
    segments.push({ text: key, kind: 'key' });
    segments.push({ text: colon, kind: 'punct' });
    if (rest.length > 0) {
      segments.push({ text: rest, kind: rest.trim().length > 0 ? 'string' : 'plain' });
    }
  } else {
    segments.push({ text: main || ' ', kind: 'plain' });
  }

  if (comment) segments.push({ text: comment, kind: 'comment' });
  return segments;
}

const lines = computed<Segment[][]>(() => props.code.replace(/\n$/, '').split('\n').map(parseLine));
</script>

<template>
  <figure class="m-yaml">
    <figcaption v-if="filename" class="m-yaml__caption">{{ filename }}</figcaption>
    <!-- A tab stop while long lines scroll sideways: the keyboard has to reach them. -->
    <pre
      ref="preRef"
      class="m-yaml__pre"
      :tabindex="focusable ? 0 : undefined"
    ><code><span v-for="(line, i) in lines" :key="i" class="m-yaml__line"><span v-for="(seg, j) in line" :key="j" :class="`m-yaml__t-${seg.kind}`">{{ seg.text }}</span></span></code></pre>
  </figure>
</template>

<style scoped>
.m-yaml {
  margin: 0;
  border: var(--mctl-border-width-hairline) solid var(--surface-line);
  background: var(--surface-card);
}

.m-yaml__caption {
  font-family: var(--font-mono);
  font-size: var(--mctl-typography-font-size-marker);
  letter-spacing: var(--mctl-typography-letter-spacing-marker);
  text-transform: uppercase;
  color: var(--surface-fg-subtle);
  padding: var(--mctl-space-2) var(--mctl-space-4);
  border-bottom: var(--mctl-border-width-hairline) solid var(--surface-line);
}

.m-yaml__pre {
  margin: 0;
  padding: var(--mctl-space-4);
  overflow-x: auto;
  font-family: var(--font-mono);
  font-size: var(--mctl-typography-font-size-marker);
  line-height: 1.7;
}

.m-yaml__pre:focus-visible {
  outline: var(--focus-ring-width) solid var(--focus-ring);
  outline-offset: calc(-1 * var(--focus-ring-offset));
}

.m-yaml__line {
  display: block;
  white-space: pre;
}

.m-yaml__t-plain {
  color: var(--surface-fg-muted);
}

.m-yaml__t-key {
  color: var(--syntax-key);
}

.m-yaml__t-string {
  color: var(--syntax-string);
}

.m-yaml__t-comment {
  color: var(--syntax-comment);
  font-style: italic;
}

.m-yaml__t-punct {
  color: var(--syntax-punctuation);
}
</style>
