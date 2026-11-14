<script lang="ts">
export interface MCardProps {
  /** Use the elevated surface token instead of card. */
  elevated?: boolean;
  /**
   * Render as a different element or component: 'article' for a card in a
   * list, 'a' or RouterLink for a card that is one link. A link card should
   * not also carry an `actions` slot, since links cannot nest.
   */
  as?: string | Component;
  /**
   * Hover and focus-within affordance (stronger border and a small shadow),
   * for a card that is or contains the thing you click.
   */
  interactive?: boolean;
  /**
   * Type family for the card's text. 'mono' (the default) keeps the
   * engineering look; 'sans' sets the display family, for editorial cards
   * such as a course catalogue.
   */
  font?: 'mono' | 'sans';
}

export interface MCardSlots {
  /** Full-bleed area above the header: an image or a gradient banner. No padding. */
  media?(): unknown;
  /** Rendered above the body, only when given. */
  header?(): unknown;
  /** The body. */
  default?(): unknown;
  /** A row of buttons under the body; wraps on narrow widths. */
  actions?(): unknown;
  /** Rendered below the body, only when given. */
  footer?(): unknown;
}
</script>

<script setup lang="ts">
import type { Component } from 'vue';

withDefaults(defineProps<MCardProps>(), {
  elevated: false,
  as: 'div',
  interactive: false,
  font: 'mono',
});
defineSlots<MCardSlots>();
</script>

<template>
  <component
    :is="as"
    class="m-card"
    :class="[
      `m-card--${font}`,
      { 'm-card--elevated': elevated, 'm-card--interactive': interactive },
    ]"
  >
    <div v-if="$slots.media" class="m-card__media">
      <slot name="media" />
    </div>
    <div v-if="$slots.header" class="m-card__header">
      <slot name="header" />
    </div>
    <div class="m-card__body">
      <slot />
    </div>
    <div v-if="$slots.actions" class="m-card__actions">
      <slot name="actions" />
    </div>
    <div v-if="$slots.footer" class="m-card__footer">
      <slot name="footer" />
    </div>
  </component>
</template>

<style scoped>
.m-card {
  display: block;
  background: var(--surface-card);
  border: var(--mctl-border-width-hairline) solid var(--surface-line);
  border-radius: var(--mctl-radius-lg);
  font-family: var(--font-mono);
  color: var(--surface-fg);
  overflow: hidden;
  text-decoration: none;
}

.m-card--sans {
  font-family: var(--font-display);
}

.m-card--elevated {
  background: var(--surface-elevated);
}

.m-card--interactive {
  transition:
    border-color var(--mctl-motion-duration-fast) var(--mctl-motion-easing-standard),
    box-shadow var(--mctl-motion-duration-fast) var(--mctl-motion-easing-standard);
}

.m-card--interactive:hover,
.m-card--interactive:focus-within {
  border-color: var(--surface-line-strong);
  box-shadow: var(--shadow-md);
}

/* A card that is itself the link or button takes the shared focus ring. */
.m-card--interactive:focus-visible {
  outline: var(--focus-ring-width) solid var(--focus-ring);
  outline-offset: var(--focus-ring-offset);
}

/* Full bleed: the card's radius and overflow clip it, so it needs none of
   its own, and it carries no divider. */
.m-card__media {
  display: block;
  line-height: 0;
}

.m-card__media > :deep(img),
.m-card__media > :deep(picture),
.m-card__media > :deep(svg) {
  display: block;
  width: 100%;
}

.m-card__header {
  padding: var(--mctl-space-4) var(--mctl-space-5);
  border-bottom: var(--mctl-border-width-hairline) solid var(--surface-line);
  font-size: var(--mctl-typography-font-size-body);
  font-weight: var(--mctl-typography-font-weight-medium);
  color: var(--surface-fg-muted);
}

.m-card__body {
  padding: var(--mctl-space-4) var(--mctl-space-5);
}

.m-card__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--mctl-space-3);
  padding: 0 var(--mctl-space-5) var(--mctl-space-5);
}

.m-card__footer {
  padding: var(--mctl-space-3) var(--mctl-space-5);
  border-top: var(--mctl-border-width-hairline) solid var(--surface-line);
  font-size: var(--mctl-typography-font-size-marker);
  color: var(--surface-fg-subtle);
}
</style>
