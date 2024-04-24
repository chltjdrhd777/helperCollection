import React, { forwardRef, PropsWithChildren, ThHTMLAttributes } from 'react';
import { RuleSet } from 'styled-components';

import * as S from '../styles/Td.styles';

export interface TdProps {
  width?: number;
  height?: number;
  $customStyles?: RuleSet<object>;
}

const Td = forwardRef<
  HTMLTableCellElement,
  PropsWithChildren<TdProps & ThHTMLAttributes<HTMLTableCellElement>>
>(({ children, ...restProps }, ref) => {
  return (
    <S.StyledTd {...restProps} ref={ref}>
      {children}
    </S.StyledTd>
  );
});

export default Td;
