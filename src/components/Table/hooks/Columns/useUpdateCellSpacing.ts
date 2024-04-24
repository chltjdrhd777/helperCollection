import React, { useLayoutEffect } from 'react';
import { updateYCellSpacing } from '../../utils/columns/updateYCellSpacing';
import { ColumnsType, useTableContext } from '../../Table';
import { ColumnTreeItem } from '../../Components/Columns';

export interface UseUpdateCellSpacingParams<DataType> extends ColumnTreeItem<DataType> {
  ref: React.MutableRefObject<HTMLTableCellElement | null>;
  dataIndexTree: ColumnsType<DataType>;
}

export default function useUpdateCellSpacing<DataType>({
  ref,
  title,
  dataIndex,
  isDataIndexColumn,
  dataIndexTree,
}: UseUpdateCellSpacingParams<DataType>) {
  const {
    tableProps: { isScrollable },
    setTableCellSpacing,
    isContentOverflow,
  } = useTableContext();
  const offsetWidth = ref?.current?.offsetWidth;

  //todo 테이블 방향이 row일 경우(조건부로 적용)
  useLayoutEffect(() => {}, [offsetWidth, isContentOverflow.x]);

  useLayoutEffect(() => {
    //테이블 방향이 column일 경우(조건부로 적용)
    updateYCellSpacing({
      el: ref?.current,
      title,
      dataIndex,
      isDataIndexColumn,
      setTableCellSpacing,
      dataIndexTree,
      isScrollable,
      isContentOverflow,
    });
  }, [offsetWidth, isContentOverflow.y]);
}
