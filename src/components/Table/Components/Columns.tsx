import React, { useMemo, useRef } from 'react';

import Th from '../Components/Th';
import { ColumnType, ColumnsType, useTableContext } from '../Table';
import { v4 as uuid } from 'uuid';

import useUpdateCellSpacing from '../hooks/Columns/useUpdateCellSpacing';
import ColumnSorter from './ColumnSorter';

//types ///////////////////////////////////////////////////////////////////////////////
export type ColumnTreeItem<DataType> = ColumnType<DataType> & { isDataIndexColumn?: boolean };
export type ColumnTreeList<DataType> = ColumnTreeItem<DataType>[];
export type ColumnTree<DataType> = ColumnTreeList<DataType>[];
export interface ColumnsProps<DataType> {
  columnTree: ColumnTree<DataType>;
  dataIndexTree?: ColumnsType<DataType>;
}
//types ///////////////////////////////////////////////////////////////////////////////

export default function Colums<DataType>({
  columnTree,
  dataIndexTree = [],
}: ColumnsProps<DataType>) {
  const { currentSortDataIdx } = useTableContext();
  const getKey = () => useMemo(() => uuid(), []);

  return (
    <>
      {columnTree.map((treeList) => (
        <tr key={getKey()}>
          {treeList.map((treeItem) => {
            const { title, colspan, dataIndex, isSortable, rowspan, isDataIndexColumn, ...rest } =
              treeItem;
            const thRef = useRef<HTMLTableCellElement | null>(null);

            useUpdateCellSpacing({
              ref: thRef,
              title,
              dataIndex,
              isDataIndexColumn,
              dataIndexTree,
            });

            return (
              <Th
                key={getKey()}
                ref={thRef}
                colSpan={colspan}
                rowSpan={rowspan}
                isCurrentSortIdx={currentSortDataIdx === dataIndex}
                {...rest}
              >
                {title}
                {isSortable && isDataIndexColumn && <ColumnSorter dataIndex={dataIndex} />}
              </Th>
            );
          })}
        </tr>
      ))}
    </>
  );
}
