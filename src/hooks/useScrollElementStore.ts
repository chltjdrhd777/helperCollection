import { MutableRefObject, useEffect, useRef } from 'react';

import smoothScrollTo from 'utils/smoothScrollTo';

// ** types
interface ScrollParams {
  behavior?: ScrollBehavior;
  offset?: number;
  duration?: number;
}
export interface ScrollElementStore {
  scrollContainerElement: HTMLElement | null;
  pivotElement: HTMLElement | null;
  onScroll: (scrollParams?: ScrollParams) => void;
}
export type MutableScrollElementStore = MutableRefObject<ScrollElementStore | null>;
interface useScrollElementStoreParams {
  scrollContainerElementId?: string;
  ExtenralScrollElementStore?: MutableScrollElementStore;
}

// ** hook
export default function useScrollElementStore<PivotElementRef>(params?: useScrollElementStoreParams) {
  let scrollElementStore: MutableRefObject<ScrollElementStore | null> = useRef<ScrollElementStore | null>(null); // export pattern
  if (params?.ExtenralScrollElementStore) scrollElementStore = params.ExtenralScrollElementStore;

  const pivotElementRef = useRef<PivotElementRef | null>(null); // 스크롤 컨테이너 기준 scrollTop을 제공해줄 Ref객체

  useEffect(() => {
    function handleScroll(scrollParams: ScrollParams) {
      if (store.scrollContainerElement && store.pivotElement) {
        const { scrollContainerElement, pivotElement } = store;

        const behavior = scrollParams?.behavior ?? 'smooth';
        const to = (pivotElement?.offsetTop ?? 0) + (scrollParams?.offset ?? 0);
        const duration = scrollParams?.duration ?? 900;

        behavior === 'smooth'
          ? smoothScrollTo(scrollContainerElement, to, duration)
          : scrollContainerElement.scrollTo({ top: to, behavior: 'instant' });
      }
    }

    const store = {
      scrollContainerElement:
        document.getElementById(params?.scrollContainerElementId ?? 'frame-layout-children-wrapper') ?? window,
      pivotElement: pivotElementRef.current,
      onScroll: handleScroll,
    } as ScrollElementStore;

    scrollElementStore.current = store;
  }, []);

  return { pivotElementRef, scrollElementStore };
}
