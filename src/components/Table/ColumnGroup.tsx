import React, { ReactNode } from 'react';
import { BaseColumnType } from './Table';

//types ///////////////////////////////////////////////////////////////////////////////
interface ColumnGroupProps<DataType> extends Omit<BaseColumnType<DataType>, 'children'> {
  children: ReactNode;
}
//types ///////////////////////////////////////////////////////////////////////////////

// 1. ColumnGroup 컴포넌트의 관심사는 props를 포함하는 React Node를 리턴하는 것이다.
// 2. ColumnGroup과는 다르게, props 내부에는 자식인 children의 React Node를 포함하고 있다.
// 3. Children을 받을 수 있기만 하면 되기 때문에, Fragment를 리턴하더라도 충분하다
export default function ColumnGroup<DataType>({ children }: ColumnGroupProps<DataType>) {
  return <></>;
}
