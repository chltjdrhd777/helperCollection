import React, { useState } from 'react';
import { useTableContext } from '../Table';

import * as S from '../styles/ColumnSorter.styles';
import useUnActivateOtherSorter from '../hooks/ColumnSorter/useUnActivateOtherSorter';
import useSortingDataSource from '../hooks/ColumnSorter/useSortingDataSource';

export type SortOrderType = 'default' | 'desc' | 'asc';
interface ColumnSorterProps {
  dataIndex?: string;
}

export default function ColumnSorter({ dataIndex }: ColumnSorterProps) {
  const SORT_ORDER_LIST: SortOrderType[] = ['default', 'desc', 'asc'];

  const { setCurrentSortDataIdx } = useTableContext();

  const [sortDirectionIdx, setSortDirectionIdx] = useState(0);
  const currentSort = SORT_ORDER_LIST[sortDirectionIdx];

  const isVisibleDefault = currentSort === 'default';

  const onChangeSortIdx = () => {
    setCurrentSortDataIdx(dataIndex ?? '');
    setSortDirectionIdx((sortDirectionIdx + 1) % SORT_ORDER_LIST.length);
  };

  //hook ///////////////////////////////////////////////////////////////
  useUnActivateOtherSorter({
    dataIndex,
    setSortDirectionIdx,
  });

  useSortingDataSource({
    dataIndex,
    currentSort,
  });

  return (
    <S.SortContainer onClick={() => onChangeSortIdx()}>
      <SortDirection direction="top" isVisible={isVisibleDefault || currentSort === 'asc'} />
      <SortDirection direction="bottom" isVisible={isVisibleDefault || currentSort === 'desc'} />
    </S.SortContainer>
  );
}

// SortDirection ///////////////////////////////////////////////////
export interface SortDirectionProps {
  fill?: string;
  direction: 'top' | 'bottom';
  isVisible?: boolean;
}

const SortDirection = ({ fill, direction, isVisible }: SortDirectionProps) => {
  return (
    <S.SortSVGWrapper direction={direction} isVisible={isVisible}>
      <svg width="9" height="9" xmlns="http://www.w3.org/2000/svg">
        <polygon points="0,9 4.5,2 9,9" fill={fill || 'gray'} />
      </svg>
    </S.SortSVGWrapper>
  );
};
