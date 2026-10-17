import { nextTick, onBeforeUnmount, watch, type Ref } from 'vue';

interface Entry {
  /** The dialog's top-level element in <body>; kept interactive. */
  top: HTMLElement | null;
  /** The overlay, which carries the dialog's z-index. */
  layer: HTMLElement | null;
  /** Where focus goes when this dialog closes. */
  returnFocus: HTMLElement | null;
}

// Shared by every modal surface (MModal, MTgSheet), so a sheet opened over a
// modal, or the other way round, still leaves exactly one dialog in charge of
// Escape, Tab and the page behind it. Page-level state (scroll lock, inert)
// is owned here rather than per dialog, so dialogs may close in any order.
const stack: Entry[] = [];

let savedOverflow = '';
let savedPaddingRight = '';
// Elements this module made inert. Anything inert for another reason is left
// alone, and never "restored".
const inerted = new Set<HTMLElement>();

// Title ids for aria-labelledby, from one counter shared by both families.
let idSeq = 0;
export const nextDialogId = (prefix: string) => `${prefix}-${++idSeq}`;

const FOCUSABLE = [
  'a[href]',
  'area[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'summary',
  'iframe',
  'audio[controls]',
  'video[controls]',
  '[contenteditable]:not([contenteditable="false"])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

function isTabbable(el: HTMLElement): boolean {
  // Taken out of the tab order on purpose, whatever its tag.
  const tabindex = el.getAttribute('tabindex');
  if (tabindex !== null && Number(tabindex) < 0) return false;
  if (el.closest('[hidden], [inert]')) return false;
  // checkVisibility covers display:none, closed <details> and, with the
  // option, visibility:hidden (which browsers refuse to focus); environments
  // without it (older browsers, jsdom) keep the element.
  const check = (
    el as HTMLElement & {
      checkVisibility?: (options?: { visibilityProperty?: boolean }) => boolean;
    }
  ).checkVisibility;
  return check ? check.call(el, { visibilityProperty: true }) : true;
}

/** The overlay's ancestor that is a direct child of <body>. */
function topLevel(el: HTMLElement | null): HTMLElement | null {
  let node = el;
  while (node?.parentElement && node.parentElement !== document.body) node = node.parentElement;
  return node?.parentElement === document.body ? node : null;
}

function lockScroll() {
  const body = document.body;
  savedOverflow = body.style.overflow;
  savedPaddingRight = body.style.paddingRight;
  // Hiding the scrollbar widens the viewport; pad the body by the
  // scrollbar's width so content does not jump sideways.
  const scrollbar = window.innerWidth - document.documentElement.clientWidth;
  if (scrollbar > 0) {
    const current = parseFloat(getComputedStyle(body).paddingRight) || 0;
    body.style.paddingRight = `${current + scrollbar}px`;
  }
  body.style.overflow = 'hidden';
}

function unlockScroll() {
  document.body.style.overflow = savedOverflow;
  document.body.style.paddingRight = savedPaddingRight;
}

/** Everything in <body> except the topmost dialog is inert; nothing when no dialog is open. */
function syncInert() {
  // Drop overlays that have left the document (a closed dialog's subtree).
  for (const el of inerted) if (!el.isConnected) inerted.delete(el);
  if (stack.length === 0) {
    for (const el of inerted) el.removeAttribute('inert');
    inerted.clear();
    return;
  }
  // The topmost dialog has not mounted yet (it resolves after a tick); leave
  // the page as it is rather than reading "no dialog" into a null.
  const top = stack[stack.length - 1].top;
  if (!top) return;
  for (const el of Array.from(document.body.children)) {
    if (!(el instanceof HTMLElement)) continue;
    if (el === top) {
      if (inerted.delete(el)) el.removeAttribute('inert');
    } else if (!el.hasAttribute('inert')) {
      // The attribute, not the property: it is what the property reflects.
      el.setAttribute('inert', '');
      inerted.add(el);
    }
  }
}

/**
 * Paint the dialog above every dialog under it in the stack. Families set
 * their own z-index in CSS, so a sheet opened over a modal could otherwise
 * be focused and topmost while painted behind the modal's scrim.
 */
function raise(entry: Entry) {
  const layer = entry.layer;
  if (!layer) return;
  const z = (el: HTMLElement) => parseInt(getComputedStyle(el).zIndex, 10) || 0;
  let floor: number | null = null;
  for (const below of stack.slice(0, stack.indexOf(entry))) {
    if (below.layer) floor = Math.max(floor ?? 0, z(below.layer));
  }
  if (floor !== null && z(layer) <= floor) layer.style.zIndex = String(floor + 1);
}

export interface DialogOptions {
  /** The element with role="dialog"; receives focus on open. */
  dialog: Ref<HTMLElement | null>;
  /** The outermost teleported element. */
  overlay: Ref<HTMLElement | null>;
  open: () => boolean;
  /** Called on Escape when this dialog is topmost and dismissible. */
  onDismiss: () => void;
  dismissible?: () => boolean;
}

/**
 * Modal behaviour for a teleported dialog: Escape for the topmost dialog only,
 * a Tab trap, focus moved in on open and returned on close, scroll lock that
 * does not shift the layout, and everything but the topmost dialog inert.
 *
 * Also returns `backdropHandlers` for an overlay that is its own backdrop:
 * dismiss only when the press both starts and ends on the backdrop, so a drag
 * between the dialog and the backdrop, in either direction, does not close it.
 */
export function useDialog(options: DialogOptions) {
  const entry: Entry = { top: null, layer: null, returnFocus: null };
  let active = false;
  let pressStart: EventTarget | null = null;
  let pressEnd: EventTarget | null = null;

  const dismissible = () => options.dismissible?.() ?? true;
  const isTopmost = () => stack[stack.length - 1] === entry;

  function focusables(): HTMLElement[] {
    const root = options.dialog.value;
    if (!root) return [];
    return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(isTabbable);
  }

  function onKeydown(event: KeyboardEvent) {
    // Escape during IME composition cancels the composition, not the dialog.
    if (!isTopmost() || event.isComposing) return;
    if (event.key === 'Escape') {
      if (dismissible()) {
        event.preventDefault();
        options.onDismiss();
      }
      return;
    }
    if (event.key !== 'Tab') return;
    const root = options.dialog.value;
    const items = focusables();
    if (items.length === 0) {
      event.preventDefault();
      root?.focus();
      return;
    }
    const first = items[0];
    const last = items[items.length - 1];
    const current = document.activeElement;
    const outside = !root?.contains(current);
    if (event.shiftKey && (current === first || current === root || outside)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && (current === last || outside)) {
      event.preventDefault();
      first.focus();
    }
  }

  async function activate() {
    if (typeof document === 'undefined' || active) return;
    active = true;
    entry.returnFocus = document.activeElement as HTMLElement | null;
    if (stack.length === 0) lockScroll();
    stack.push(entry);
    document.addEventListener('keydown', onKeydown);
    await nextTick();
    if (!active) return;
    entry.layer = options.overlay.value;
    entry.top = topLevel(entry.layer);
    raise(entry);
    syncInert();
    options.dialog.value?.focus();
  }

  function deactivate() {
    if (typeof document === 'undefined' || !active) return;
    active = false;
    document.removeEventListener('keydown', onKeydown);
    const i = stack.indexOf(entry);
    const wasTopmost = i === stack.length - 1;
    if (i !== -1) {
      // Closing from under other dialogs: any opened from inside this one
      // would return focus into a subtree that is about to disappear. Hand
      // them this dialog's own target instead, however deep the stack. Before
      // its first tick `top` is unresolved; the overlay still bounds it.
      const subtree = entry.top ?? options.overlay.value;
      for (const above of stack.slice(i + 1)) {
        if (!above.returnFocus || subtree?.contains(above.returnFocus)) {
          above.returnFocus = entry.returnFocus;
        }
      }
      stack.splice(i, 1);
    }
    syncInert();
    if (stack.length === 0) unlockScroll();
    // Only the topmost dialog moves focus; a lower one closing leaves focus in
    // the dialog that is still open.
    if (wasTopmost && entry.returnFocus?.isConnected) entry.returnFocus.focus();
    entry.returnFocus = null;
    entry.top = null;
    entry.layer = null;
  }

  const backdropHandlers = {
    onPointerdown(event: PointerEvent) {
      pressStart = event.target;
      pressEnd = null;
    },
    onPointerup(event: PointerEvent) {
      pressEnd = event.target;
    },
    onClick(event: MouseEvent) {
      const backdrop = event.currentTarget;
      // click lands on the common ancestor of press and release, which is the
      // backdrop for any drag that crosses the dialog edge, so check both ends.
      if (
        event.target === backdrop &&
        pressStart === backdrop &&
        (pressEnd === null || pressEnd === backdrop) &&
        dismissible()
      ) {
        options.onDismiss();
      }
      pressStart = pressEnd = null;
    },
  };

  // immediate: a dialog mounted already open still locks and traps.
  watch(options.open, (isOpen) => (isOpen ? activate() : deactivate()), { immediate: true });
  onBeforeUnmount(deactivate);

  return { backdropHandlers };
}
