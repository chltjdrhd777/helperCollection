import { useState } from 'react';
import { RowsType, TableProps } from '../Table';

interface UseTableStateProps<DataType> extends TableProps<DataType> {
  dataSource: RowsType<DataType>;
}

export default function useTableContextState<DataType = []>({
  dataSource,
  ...tableProps
}: UseTableStateProps<DataType>) {
  const initialDataSource = [...dataSource];
  const [_dataSource, _setDataSource] = useState(dataSource);

  const [tableCellSpacing, setTableCellSpacing] = useState<Map<number, number>>(new Map());
  const [isContentOverflow, setIsContentOverflow] = useState<{ x: boolean; y: boolean }>({
    x: false,
    y: false,
  });

  const [currentSortDataIdx, setCurrentSortDataIdx] = useState('');

  return {
    tableProps,

    initialDataSource,
    _dataSource,
    _setDataSource,

    tableCellSpacing,
    setTableCellSpacing,

    isContentOverflow,
    setIsContentOverflow,

    currentSortDataIdx,
    setCurrentSortDataIdx,
  };
}
