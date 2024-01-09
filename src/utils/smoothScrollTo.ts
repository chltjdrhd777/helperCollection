export default function smoothScrollTo(
  scrollElement: HTMLElement,
  to: number,
  duration: number,
): void {
  // 고정 클로져 상수
  const startScrollPosition = scrollElement.scrollTop;
  const totalMoveRange = to - startScrollPosition;
  const scrollStartTime = performance.now();

  function animateScroll(rAFcallTime: number) {
    const elapsed = rAFcallTime - scrollStartTime;
    const progress = Math.min(elapsed / duration, 1);
    const bazier = (progress: number) =>
      progress < 0.5
        ? 4 * progress ** 3
        : 1 + (progress - 1) * (2 * progress - 2) * (2 * progress - 2);
    const newPosition = startScrollPosition + totalMoveRange * bazier(progress);

    scrollElement.scrollTop = newPosition;

    if (elapsed < duration) {
      requestAnimationFrame(animateScroll);
    }
  }

  requestAnimationFrame(animateScroll);
}
