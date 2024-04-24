import { ReactNode, isValidElement } from 'react';
import { RowsType } from '../../Table';

//types ///////////////////////////////////////////////////////////////////////////////
interface GetTargetRowsParams<DataType> {
  rows?: ReactNode;
  dataSource?: RowsType<DataType>;
}
//types ///////////////////////////////////////////////////////////////////////////////

export default function getTargetRows<DataType>({
  rows,
  dataSource,
}: GetTargetRowsParams<DataType>) {
  const _rows = (() => {
    if (!rows || !isValidElement(rows)) return null;
    return rows;
  })();

  return dataSource ? dataSource : _rows;
}
