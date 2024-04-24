import React from 'react';

import { BaseColumnType } from './Table';

//types ///////////////////////////////////////////////////////////////////////////////
export interface ColumnProps<DataType> extends BaseColumnType<DataType> {}
//types ///////////////////////////////////////////////////////////////////////////////

// Column 컴포넌트의 관심사는 props를 포함하는 React Node 를 리턴하는 것이다.
// 따라서 Fragment만 리턴하더라도 충분하다.
export default function Column<DataType>(columnProps: ColumnProps<DataType>) {
  return <></>;
}
