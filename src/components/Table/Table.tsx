import { ReactNode, useMemo } from 'react';

export { default as Column } from './Column';
export { default as ColumnGroup } from './ColumnGroup';

import * as S from './styles/Table.styles';

import getColumnTree from './utils/columns/getColumnTree';
import { ReactNodeType } from './utils/columns/childrenToColumns';
import { RuleSet, css as styledCSS } from 'styled-components';
import getTargetColumns from './utils/columns/getTargetColumns';

import Columns from './Components/Columns';
import Rows from './Components/Rows';

import createContext from './contexts/createContext';
import useTableContextState from './contexts/useTableContextState';
import { UseCheckboxParams } from './hooks/useCheckBox';

//todo
// 0. horizental table = 이건 테이블 컴포넌트 따로 제작.(props 달리 되어야 함.)
// 1. collapsable table
// 2. checkable
// 3. reactive css
// 4. column with changer
// 5. search or pagination comp (optional)

//types ///////////////////////////////////////////////////////////////////////////////
export interface BaseColumnType<DataType> {
  title?: string;
  dataIndex?: string;
  colspan?: number;

  rowspan?: number;
  width?: number;
  height?: number;
  children?: ColumnsType<DataType>;

  render?: (data: DataType) => ReactNode;
  isSortable?: boolean;
  isCheckable?: UseCheckboxParams<DataType, boolean | { [key: string]: any }> & {};
}
export interface BaseRowType<DataType> extends Omit<BaseColumnType<DataType>, 'children'> {
  [key: string]: unknown;
}

export interface ColumnType<DataType> extends BaseColumnType<DataType> {}
export interface RowType<DataType> extends BaseRowType<DataType> {}

export type ColumnsType<DataType> = ColumnType<DataType>[];
export type RowsType<DataType> = (DataType & RowType<DataType>)[];

export interface TableProps<DataType> extends StyledTableProps {
  columns?: ColumnsType<DataType>;
  rows?: ReactNode;
  dataSource?: RowsType<DataType>;
  statusComponent?: {
    fetchStatus?: {
      isLoading?: boolean;
      isError?: boolean;
    };
    emptyRender?: ReactNode;
    loadingRender?: ReactNode;
    errorRender?: ReactNode;
  };
  children?: ReactNodeType<DataType>;
}

export type $CustomStyles = ((css: typeof styledCSS) => RuleSet<object>) | RuleSet<object>;
export interface StyledTableProps {
  bordered?: boolean;
  borderRadius?: number;

  isScrollable?: {
    x?:
      | boolean
      | {
          enabled?: boolean;
          scrollHeight?: number;
          $customStyles?: $CustomStyles;
        };
    y?:
      | boolean
      | {
          enabled?: boolean;
          scrollWidth?: number;
          $customStyles?: $CustomStyles;
        };
  };

  $customStyles?: $CustomStyles;
}

export type UseTableStateReturnType = ReturnType<typeof useTableContextState>;
//types ///////////////////////////////////////////////////////////////////////////////

export const { Provider: TableProvider, useContext: useTableContext } =
  createContext<UseTableStateReturnType>();

export default function Table<DataType extends any>(tableProps: TableProps<DataType>) {
  const {
    columns,
    children,

    rows,
    dataSource = [],
    statusComponent,

    ...styledTableProps
  } = tableProps;

  const value = useTableContextState<DataType>({ dataSource, ...tableProps });

  //columns
  const targetColumns = getTargetColumns({
    columns,
    children,
  });

  const { columnTree, dataIndexTree } = useMemo(
    () =>
      getColumnTree({
        columns: targetColumns,
      }),
    [targetColumns],
  );

  return (
    <TableProvider value={value}>
      <S.Table {...styledTableProps} isContentOverflow={value.isContentOverflow}>
        <thead>
          <Columns columnTree={columnTree} dataIndexTree={dataIndexTree} />
        </thead>
        <tbody>
          <Rows dataIndexTree={dataIndexTree} statusComponent={statusComponent} />
        </tbody>
      </S.Table>
    </TableProvider>
  );
}
