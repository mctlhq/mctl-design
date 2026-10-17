import { nextTick, onBeforeUnmount, watch, type Ref } from 'vue';

// Shared by every modal surface (MModal, MTgSheet), so a sheet opened over a
// modal, or the other way round, still leaves exactly one dialog in charge of
// Escape, Tab and the page behind it.
const stack: symbol[] = [];

// Saved page state, held while any dialog is open: the first dialog to open
// locks scroll, the last to close restores it.
let savedOverflow = '';
let savedPaddingRight = '';

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

function isVisible(el: HTMLElement): boolean {
  if (el.closest('[hidden], [inert]')) return false;
  // checkVisibility covers display:none and closed <details>; environments
  // without it (older browsers, jsdom) keep the element.
  const check = (el as HTMLElement & { checkVisibility?: () => boolean }).checkVisibility;
  return check ? check.call(el) : true;
}

export interface DialogOptions {
  /** The element with role="dialog"; receives focus on open. */
  dialog: Ref<HTMLElement | null>;
  /** The outermost teleported element. Its siblings in <body> are made inert. */
  overlay: Ref<HTMLElement | null>;
  open: () => boolean;
  /** Called on Escape when this dialog is topmost and dismissible. */
  onDismiss: () => void;
  dismissible?: () => boolean;
}

/**
 * Modal behaviour for a teleported dialog: Escape for the topmost dialog only,
 * a Tab trap, focus moved in on open and returned on close, scroll lock that
 * does not shift the layout, and the rest of the page made inert.
 *
 * Also returns `backdropHandlers` for the overlay: dismiss only when the press
 * both started and ended on the backdrop, so a drag that begins inside the
 * dialog (selecting text) and ends outside does not close it.
 */
export function useDialog(options: DialogOptions) {
  const key = Symbol('m-dialog');
  let active = false;
  let returnFocus: HTMLElement | null = null;
  let inerted: HTMLElement[] = [];
  let pressStartedOnBackdrop = false;

  const dismissible = () => options.dismissible?.() ?? true;
  const isTopmost = () => stack[stack.length - 1] === key;

  function focusables(): HTMLElement[] {
    const root = options.dialog.value;
    if (!root) return [];
    return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(isVisible);
  }

  function onKeydown(event: KeyboardEvent) {
    if (!isTopmost()) return;
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

  function lockScroll() {
    const body = document.body;
    savedOverflow = body.style.overflow;
    savedPaddingRight = body.style.paddingRight;
    // Hiding the scrollbar narrows nothing but widens the viewport; pad the
    // body by the scrollbar's width so content does not jump sideways.
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

  function inertSiblings() {
    // Walk up to the overlay's top-level ancestor in <body>, so a wrapper
    // between the teleport target and the overlay is not mistaken for page.
    let top = options.overlay.value;
    while (top?.parentElement && top.parentElement !== document.body) top = top.parentElement;
    if (!top || top.parentElement !== document.body) return;
    for (const el of Array.from(document.body.children)) {
      // The attribute, not the property: it is what the property reflects,
      // and a sibling that is already inert stays the owner's to restore.
      if (el === top || !(el instanceof HTMLElement) || el.hasAttribute('inert')) continue;
      el.setAttribute('inert', '');
      inerted.push(el);
    }
  }

  function restoreSiblings() {
    for (const el of inerted) el.removeAttribute('inert');
    inerted = [];
  }

  async function activate() {
    if (typeof document === 'undefined' || active) return;
    active = true;
    returnFocus = document.activeElement as HTMLElement | null;
    if (stack.length === 0) lockScroll();
    stack.push(key);
    document.addEventListener('keydown', onKeydown);
    await nextTick();
    if (!active) return;
    inertSiblings();
    options.dialog.value?.focus();
  }

  function deactivate() {
    if (typeof document === 'undefined' || !active) return;
    active = false;
    document.removeEventListener('keydown', onKeydown);
    restoreSiblings();
    const i = stack.lastIndexOf(key);
    if (i !== -1) stack.splice(i, 1);
    if (stack.length === 0) unlockScroll();
    if (returnFocus?.isConnected) returnFocus.focus();
    returnFocus = null;
  }

  const backdropHandlers = {
    onPointerdown(event: PointerEvent) {
      pressStartedOnBackdrop = event.target === event.currentTarget;
    },
    onClick(event: MouseEvent) {
      const onBackdrop = event.target === event.currentTarget;
      if (onBackdrop && pressStartedOnBackdrop && dismissible()) options.onDismiss();
      pressStartedOnBackdrop = false;
    },
  };

  // immediate: a dialog mounted already open still locks and traps.
  watch(options.open, (isOpen) => (isOpen ? activate() : deactivate()), { immediate: true });
  onBeforeUnmount(deactivate);

  return { backdropHandlers };
}
