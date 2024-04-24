import React, { ReactNode, useRef } from 'react';

import { ColumnsType, TableProps, useTableContext } from '../Table';

import { v4 as uuid } from 'uuid';
import Td from './Td';

import useUpdateContentOverflow from '../hooks/Columns/useUpdateContentOverflow';
import RowLoadingSpinner from './RowLoadingSpinner';

interface RowsProps<DataType> {
  dataIndexTree?: ColumnsType<DataType>;
}

export default function Rows<DataType>({
  statusComponent = {},
  dataIndexTree = [],
}: TableProps<DataType> & RowsProps<DataType>) {
  const { _dataSource = [], tableCellSpacing } = useTableContext();
  const { fetchStatus, errorRender, loadingRender, emptyRender } = statusComponent;

  const dataRendered = _dataSource.map((source, idx) => {
    const trRef = useRef<HTMLTableRowElement | null>(null);
    const isLastRow = idx === _dataSource.length - 1;

    useUpdateContentOverflow({ ref: trRef, isLastRow });

    return (
      <tr key={uuid()} ref={trRef}>
        {dataIndexTree.map(({ dataIndex = '', render }, idx) => {
          const children = render ? render(source as DataType) : (source[dataIndex] as ReactNode);

          return (
            <Td key={uuid()} {...source} width={tableCellSpacing.get(idx)}>
              {children}
            </Td>
          );
        })}
      </tr>
    );
  });

  //@ render cases /////////////////////////////////////////////////////////////
  if (fetchStatus?.isError) {
    return errorRender ?? <></>;
  }

  if (fetchStatus?.isLoading) {
    return <RowLoadingSpinner loadingRender={loadingRender}>{dataRendered}</RowLoadingSpinner>;
  }

  if (!_dataSource?.length) {
    return emptyRender ?? <></>;
  }

  return dataRendered;
}
