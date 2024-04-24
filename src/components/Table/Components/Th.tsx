import React, { PropsWithChildren, ThHTMLAttributes, forwardRef } from 'react';

import { RuleSet } from 'styled-components';
import * as S from '../styles/Th.styles';

import { getClassName } from '../utils/getClassName';

export interface ThProps {
  width?: number;
  height?: number;

  isCurrentSortIdx?: boolean;

  $customStyles?: RuleSet<object>;
}

const Th = forwardRef<
  HTMLTableCellElement,
  PropsWithChildren<ThProps & ThHTMLAttributes<HTMLTableCellElement>>
>(({ children, isCurrentSortIdx, ...restProps }, ref) => {
  return (
    <S.StyledTh
      className={getClassName([{ isCurrentSortIdx: !!isCurrentSortIdx }])}
      {...restProps}
      ref={ref}
    >
      <div className="th-contents">{children}</div>
    </S.StyledTh>
  );
});

export default Th;
