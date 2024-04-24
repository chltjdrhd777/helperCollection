import { useEffect } from 'react';
import { useTableContext } from '../../Table';

interface useUnActivateOtherSorterParmas {
  dataIndex: string | undefined;
  setSortDirectionIdx: React.Dispatch<React.SetStateAction<number>>;
}
export default function useUnActivateOtherSorter({
  dataIndex,
  setSortDirectionIdx,
}: useUnActivateOtherSorterParmas) {
  const { currentSortDataIdx } = useTableContext();

  useEffect(() => {
    if (currentSortDataIdx !== dataIndex) {
      setSortDirectionIdx(0);
    }
  }, [currentSortDataIdx]);
}
