import { useLayoutEffect, useState, type RefObject } from 'react';

function hasVerticalOverflow(el: HTMLElement): boolean {
  return el.scrollHeight > el.clientHeight + 1;
}

/**
 * True when the scroll container's content extends past its visible height.
 * Re-evaluates on resize, DOM changes, and scroll (for layout shifts).
 */
export function useOverflowBottomFade(
  ref: RefObject<HTMLElement | null>,
  deps: ReadonlyArray<unknown> = [],
): boolean {
  const [showFade, setShowFade] = useState(false);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const update = () => {
      setShowFade(hasVerticalOverflow(el));
    };

    update();

    const resizeObserver = new ResizeObserver(update);
    resizeObserver.observe(el);

    const rowGroup = el.querySelector('[role="rowgroup"]');
    if (rowGroup) {
      resizeObserver.observe(rowGroup);
    }

    const mutationObserver = new MutationObserver(update);
    mutationObserver.observe(el, { childList: true, subtree: true });

    el.addEventListener('scroll', update, { passive: true });

    return () => {
      resizeObserver.disconnect();
      mutationObserver.disconnect();
      el.removeEventListener('scroll', update);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- caller passes row/tab deps
  }, [ref, ...deps]);

  return showFade;
}
