const scrollBehaviorSupported = 'scrollBehavior' in document.documentElement.style;

export function smoothScroll(scrollableEl: HTMLElement, prop: "scrollLeft" | "scrollTop", position: number) {
  if (scrollBehaviorSupported) {
    scrollableEl[prop] = position;
  } else {
    if (scrollableEl.dataset.scrollAnimId) {
      cancelAnimationFrame(+scrollableEl.dataset.scrollAnimId);
    }

    const speed = 4;
    let startPos = scrollableEl.dataset[prop] ? +scrollableEl.dataset[prop]! : scrollableEl[prop];
    let startTime: number;
    let done = false;
    const offset = position - startPos <= 1000 ? position - startPos : position;

    if (offset === 0) {
      return;
    }

    function step(timestamp: number) {
      if (startTime === undefined) {
        startTime = timestamp;
      }
      const elapsed = timestamp - startTime;
      const count = offset > 0 ? Math.min(speed * elapsed, offset) : Math.max(-speed * elapsed, offset);
      const newPos = startPos + count;
      scrollableEl[prop] = newPos;
      scrollableEl.dataset[prop] = String(newPos);

      if ((offset > 0 && scrollableEl[prop] >= position) || (offset < 0 && scrollableEl[prop] <= position)) {
        done = true;
      }

      if (!done) {
        scrollableEl.dataset.scrollAnimId = requestAnimationFrame(step).toString();
      } else {
        delete scrollableEl.dataset.scrollAnimId;
      }
    }

    scrollableEl.dataset.scrollAnimId = requestAnimationFrame(step).toString();
  }
}
