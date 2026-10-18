import { onBeforeUnmount, onMounted, ref, type Ref } from 'vue';

/**
 * Whether a scroll container should be a tab stop. The keyboard has to be
 * able to reach content that scrolls (WCAG 2.1.1), but a container that fits
 * is an empty stop. Starts true, so the server render and a page without JS
 * stay reachable and hydration sees the same attribute; measured after mount
 * and whenever the container or its content resizes. Without ResizeObserver
 * it stays true.
 */
export function useScrollFocus(el: Ref<HTMLElement | null>) {
  const focusable = ref(true);
  let observer: ResizeObserver | undefined;

  const measure = () => {
    const node = el.value;
    if (!node) return;
    focusable.value = node.scrollWidth > node.clientWidth || node.scrollHeight > node.clientHeight;
  };

  onMounted(() => {
    const node = el.value;
    if (!node || typeof ResizeObserver === 'undefined') return;
    observer = new ResizeObserver(measure);
    observer.observe(node);
    // The content grows without the container resizing (a longer line, more
    // rows), so watch it too.
    if (node.firstElementChild) observer.observe(node.firstElementChild);
    measure();
  });
  onBeforeUnmount(() => observer?.disconnect());

  return focusable;
}
