<script lang="ts">
export interface MTgStatusBadgeProps {
  status:
    | 'active'
    | 'reserved'
    | 'accepted'
    | 'pending'
    | 'completed'
    | 'cancelled'
    | 'rejected'
    | 'expired';
}
</script>

<script setup lang="ts">
defineProps<MTgStatusBadgeProps>();

// Keyed by every status, so adding one to the union without a label fails
// the typecheck. The template still falls back to the raw value for a status
// a plain-JS consumer passes from a newer backend.
const labelMap: Record<MTgStatusBadgeProps['status'], string> = {
  active: 'Active',
  reserved: 'Reserved',
  accepted: 'Accepted',
  pending: 'Pending',
  completed: 'Completed',
  cancelled: 'Cancelled',
  rejected: 'Rejected',
  expired: 'Expired',
};
</script>

<template>
  <span class="m-tg-status-badge" :class="`m-tg-status-badge--${status}`">
    {{ labelMap[status] ?? status }}
  </span>
</template>

<style scoped>
.m-tg-status-badge {
  display: inline-flex;
  align-items: center;
  font-family: var(--tg-font, 'Onest', system-ui, -apple-system, sans-serif);
  font-size: 12px;
  font-weight: 500;
  padding: 3px 10px;
  border-radius: var(--tg-radius-chip, 10px);
  white-space: nowrap;
}

/* Active / green */
.m-tg-status-badge--active,
.m-tg-status-badge--completed,
.m-tg-status-badge--accepted {
  color: var(--tg-success-text, #1c6e42);
  background: color-mix(in srgb, var(--tg-success, #1f9d57) 12%, transparent);
}

/* Blue / in-progress */
.m-tg-status-badge--reserved,
.m-tg-status-badge--pending {
  color: var(--tg-accent-text, #2869ca);
  background: var(--tg-accent-soft, #eaf1fe);
}

/* Red / closed */
.m-tg-status-badge--cancelled,
.m-tg-status-badge--rejected,
.m-tg-status-badge--expired {
  color: var(--tg-danger-text, #af3c3d);
  background: color-mix(in srgb, var(--tg-danger, #d64545) 10%, transparent);
}
</style>
