import { ColumnsType } from '../../Table';
import childrenToColumns, { ReactNodeType } from './childrenToColumns';

//types ///////////////////////////////////////////////////////////////////////////////
interface GetTargetColumnsParams<DataType> {
  columns?: ColumnsType<DataType>;
  children?: ReactNodeType<DataType>;
}
//types ///////////////////////////////////////////////////////////////////////////////

export default function getTargetColumns<DataType>({
  columns,
  children,
}: GetTargetColumnsParams<DataType>) {
  const _columns = (() => {
    if (!columns) return [];
    if (Array.isArray(columns)) return columns;

    return [columns];
  })();

  return children ? (childrenToColumns(children) as ColumnsType<DataType>) : _columns;
}
