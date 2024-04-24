import React, { useLayoutEffect } from 'react';
import { useTableContext } from '../../Table';

interface UseUpdateContentOverflowParams {
  ref: React.MutableRefObject<HTMLTableRowElement | null>;
  isLastRow?: boolean;
}

export default function useUpdateContentOverflow({
  ref,
  isLastRow,
}: UseUpdateContentOverflowParams) {
  const {
    tableProps: { isScrollable },
    setIsContentOverflow,
  } = useTableContext();

  const isXScrollEabled =
    typeof isScrollable?.x === 'object' ? isScrollable.x?.enabled : isScrollable?.x === true;
  const isYScrollEnabled =
    typeof isScrollable?.y === 'object' ? isScrollable.y?.enabled : isScrollable?.y === true;

  useLayoutEffect(() => {
    if (isXScrollEabled) {
    }

    if (isYScrollEnabled && isLastRow) {
      const lastTr = ref.current;
      const lastTrHeight = lastTr?.offsetHeight ?? 0;
      const trOffsetTop = lastTr?.offsetTop ?? 0;

      const tbodyHeight = lastTr?.parentElement?.offsetHeight ?? Number.MAX_SAFE_INTEGER;
      const offsetBottom = tbodyHeight - (trOffsetTop + lastTrHeight);

      if (offsetBottom < 0) {
        setIsContentOverflow((prev) => ({ ...prev, y: true }));
      }
    }
  }, [isXScrollEabled, isYScrollEnabled]);
}
