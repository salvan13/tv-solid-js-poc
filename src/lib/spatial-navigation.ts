function focus(nextEl: HTMLElement | null) {
  if(nextEl) {
    if (nextEl.tagName === "A") {
      Array.from(nextEl.parentElement?.children || []).forEach((el) => delete (el as HTMLElement)?.dataset.lastFocus);
      nextEl.dataset.lastFocus = Date.now().toString();
      nextEl.focus({ preventScroll: true });
    } else {
      const latestFocused = Array.from(nextEl.querySelectorAll("a[data-last-focus]") as NodeListOf<HTMLElement>);
      if(latestFocused.length > 0) {
        latestFocused.sort((el1, el2) => Number(el2.dataset.lastFocus) - Number(el1.dataset.lastFocus));
        focus(latestFocused[0]);
      } else {
        focus(nextEl.querySelector("a"));
      }
    }
  }
}

window.addEventListener("keydown", (e) => {
  if (e.key.startsWith("Arrow")) {
    e.preventDefault();
    e.stopPropagation();

    if (!document.activeElement || document.activeElement.nodeName === "BODY") {
      focus(document.querySelector("#main-menu"));
      return;
    }

    // navigation between siblings
    const current = e.target as HTMLElement;
    const parent = current.parentElement as HTMLElement;
    const direction = getComputedStyle(parent).flexDirection;
    if(direction) {
      const setup = direction === "column" ? {
        forward: "ArrowDown",
        backward: "ArrowUp"
      } : {
        forward: "ArrowRight",
        backward: "ArrowLeft"
      };
      let nextEl: HTMLElement | null = null;
      if (e.key === setup.forward && current.nextElementSibling) {
        nextEl = current.nextElementSibling as HTMLElement;
      } else if (e.key === setup.backward && current.previousElementSibling) {
        nextEl = current.previousElementSibling as HTMLElement;
      }
      if (nextEl) {
        focus(nextEl);
        return;
      }
    }

    // navigation between focus containers
    const container = current.closest("[data-focus-container]") as HTMLElement;
    if (container) {
      let nextSelector;
      switch (e.key) {
        case "ArrowDown":
          nextSelector = container.dataset.focusDown;
          break;
        case "ArrowUp":
          nextSelector = container.dataset.focusUp;
          break;
        case "ArrowRight":
          nextSelector = container.dataset.focusRight;
          break;
        case "ArrowLeft":
          nextSelector = container.dataset.focusLeft;
          break;
        default:
          break;
      }
      if (nextSelector) {
        const nextEl = document.querySelector(nextSelector) as HTMLElement | null;
        if (nextEl) {
          if (nextEl.tagName === "A") {
            focus(nextEl);
          } else {
            const latestFocused = Array.from(nextEl.querySelectorAll("a[data-last-focus]") as NodeListOf<HTMLElement>);
            if(latestFocused.length > 0) {
              latestFocused.sort((el1, el2) => Number(el2.dataset.lastFocus) - Number(el1.dataset.lastFocus));
              focus(latestFocused[0]);
            } else {
              focus(nextEl.querySelector("a"));
            }
          }
        }
      }
    }
  }
});

type SavedFocus = {
  [context: string]: string
}

const savedFocus: SavedFocus = {};

export function saveFocus(context: string, el: HTMLElement) {
  if(el && el.dataset.focusId) {
    savedFocus[context] = el.dataset.focusId;
  }
}

export function restoreFocus(context: string) {
  if(savedFocus[context]) {
    focus(document.querySelector<HTMLElement>(`[data-focus-id="${savedFocus[context]}"]`));
  }
}

export function hasSavedFocus(context: string): boolean {
  return Boolean(savedFocus[context]);
}

export function focusFirst(el: Element) {
  focus(el.querySelector("a"));
}
