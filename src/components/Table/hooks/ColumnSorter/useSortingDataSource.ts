import { useEffect } from 'react';
import { SortOrderType } from '../../Components/ColumnSorter';
import { RowType, useTableContext } from '../../Table';

interface UseSortingDataSourceParams {
  dataIndex?: string;
  currentSort: SortOrderType;
}
export default function useSortingDataSource({
  dataIndex = '',
  currentSort,
}: UseSortingDataSourceParams) {
  const { currentSortDataIdx, setCurrentSortDataIdx, _setDataSource, initialDataSource } =
    useTableContext();

  const isDefaultFilter = currentSortDataIdx === dataIndex && currentSort === 'default';

  const comparison = ({
    dataList,
    direction,
    dataIndex,
  }: {
    dataList: RowType<unknown>[];
    direction: Exclude<SortOrderType, 'default'>;
    dataIndex: string;
  }) => {
    const [data1, data2] = dataList;
    const value1 = data1[dataIndex];
    const value2 = data2[dataIndex];

    if (typeof value1 === 'number' && typeof value2 === 'number') {
      return direction === 'desc' ? value2 - value1 : value1 - value2;
    }

    return direction === 'desc'
      ? String(value2).localeCompare(String(value1))
      : String(value1).localeCompare(String(value2));
  };

  const sortAndSetDataSource = (direction: Exclude<SortOrderType, 'default'>) => {
    const sorted = [...initialDataSource].sort((data1, data2) =>
      comparison({ dataList: [data1, data2], direction, dataIndex }),
    );
    _setDataSource(sorted);
  };

  useEffect(() => {
    if (isDefaultFilter) {
      setCurrentSortDataIdx('');
      return _setDataSource(initialDataSource);
    }

    sortAndSetDataSource(currentSort as Exclude<SortOrderType, 'default'>);
  }, [currentSort]);
}
