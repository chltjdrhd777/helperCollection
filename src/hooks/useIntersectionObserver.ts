import { useEffect, useRef } from 'react';
import { FetchNextPageOptions, InfiniteQueryObserverResult } from '@tanstack/react-query';

//hook props interface
interface IuseIntersectionObserverProps<T> {
  threshold?: number;
  hasNextPage: boolean | undefined;
  fetchNextPage: (options?: FetchNextPageOptions | undefined) => Promise<InfiniteQueryObserverResult<T, unknown>>;
  enabled?: boolean;
}

export function useIntersectionObserver<T>({
  threshold = 0.1,
  hasNextPage,
  fetchNextPage,
}: IuseIntersectionObserverProps<T>) {
  const observedTargetRef = useRef<HTMLDivElement | null>(null);

  const observerCallback: IntersectionObserverCallback = (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && hasNextPage) {
        fetchNextPage();
      }
    });
  };

  useEffect(() => {
    if (!observedTargetRef.current) return;

    //ointersection observer 인스턴스 생성
    const observer = new IntersectionObserver(observerCallback, {
      threshold,
    });

    // 타겟 관찰 시작
    observer.observe(observedTargetRef.current as HTMLDivElement);

    // 관찰 멈춤
    return () => {
      if (observedTargetRef.current) {
        observer.unobserve(observedTargetRef.current as HTMLDivElement);
      }
    };
  }, [observerCallback, threshold, observedTargetRef]);

  return { observedTargetRef };
}
