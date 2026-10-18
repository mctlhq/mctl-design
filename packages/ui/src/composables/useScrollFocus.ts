import { onBeforeUnmount, onMounted, onUpdated, ref, type Ref } from 'vue';

/**
 * Whether a scroll container should be a tab stop. The keyboard has to be
 * able to reach content that scrolls (WCAG 2.1.1), but a container that fits
 * is an empty stop. Starts true, so the server render and a page without JS
 * stay reachable and hydration sees the same attribute; measured after mount,
 * after every re-render of the calling component (new content), and whenever
 * the container or its content box resizes. Without ResizeObserver it stays
 * true.
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
    // A table grows with its rows without the container resizing, so watch
    // it too. An inline <code> is never reported, which is what onUpdated
    // below covers.
    if (node.firstElementChild) observer.observe(node.firstElementChild);
    measure();
  });
  // A changed prop or slot (a wider line, another row) re-renders the
  // component; measure the new content then. Only with an observer: one
  // measurement it never refreshes could drop the stop for good.
  onUpdated(() => {
    if (observer) measure();
  });
  onBeforeUnmount(() => observer?.disconnect());

  return focusable;
}
