<script setup lang="ts">
withDefaults(
  defineProps<{
    status:
      | 'active'
      | 'reserved'
      | 'accepted'
      | 'pending'
      | 'completed'
      | 'cancelled'
      | 'rejected'
      | 'expired';
  }>(),
  {},
);

const labelMap: Record<string, string> = {
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
  font-family: 'Onest', system-ui, sans-serif;
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
  color: var(--tg-success, #1f9d57);
  background: color-mix(in srgb, var(--tg-success, #1f9d57) 12%, transparent);
}

/* Blue / in-progress */
.m-tg-status-badge--reserved,
.m-tg-status-badge--pending {
  color: var(--tg-accent, #2d7df6);
  background: var(--tg-accent-soft, #eaf1fe);
}

/* Red / closed */
.m-tg-status-badge--cancelled,
.m-tg-status-badge--rejected,
.m-tg-status-badge--expired {
  color: var(--tg-danger, #d64545);
  background: color-mix(in srgb, var(--tg-danger, #d64545) 10%, transparent);
}
</style>
