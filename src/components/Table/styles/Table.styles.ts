import styled, { css } from 'styled-components';
import { StyledTableProps, UseTableStateReturnType } from '../Table';
import { DEFAULT_SCROLL_WIDTH } from '../constants/scroll';

export const Table = styled.table<StyledTableProps & Partial<UseTableStateReturnType>>`
  border-collapse: collapse;
  overflow: hidden;

  // 아래 임시적용
  width: 800px;
  height: 500px;
  ///////////////

  thead {
    display: inline-table;
    width: 100%;
  }

  tbody {
    display: block;
    width: inherit;
    height: inherit;
    overflow: hidden;
  }

  // border 적용
  ${({ bordered }) => bordered && setBorder}

  // border radius 적용
  ${({ borderRadius }) => setBorderRadius(borderRadius)}

  // scroll 적용
  ${({ isScrollable, isContentOverflow }) =>
    isScrollable && setScroll(isScrollable, isContentOverflow)}

  //custom style 적용 (style 컨트롤을 위함);
  ${({ $customStyles }) =>
    typeof $customStyles === 'function' ? $customStyles(css) : $customStyles}
`;

//utils ///////////////////////////////////////////////////////////////////////////////

const setBorder = css`
  box-shadow: 0 0 0 1px black;

  th,
  td {
    border: 1px solid black;
  }

  /* thead */
  thead th {
    border-top-width: 0;
    &:first-of-type {
      border-left-width: 0;
    }

    &:last-of-type {
      border-right-width: 0;
    }
  }

  /* tbody */
  tbody tr:first-of-type > td {
    border-top-width: 0;
  }

  tbody tr > td {
    &:first-of-type {
      border-left-width: 0;
    }
    &:last-of-type {
      border-right-width: 0;
    }
  }
`;

export const setBorderRadius = (radius?: number) => css`
  border-spacing: 0;
  border-radius: ${radius ?? 10}px;
`;

export const setScroll = (
  isScrollable: NonNullable<StyledTableProps['isScrollable']>,
  isContentOverflow?: UseTableStateReturnType['isContentOverflow'],
) => {
  const { x, y } = isScrollable;
  const isXScrollEnabled = typeof x === 'object' ? x.enabled : x === true;
  const isYScrollEnabled = typeof y === 'object' ? y.enabled : y === true;

  const setCustomYScrollStyle = () => {
    const isShouldScrollYShown = isYScrollEnabled && isContentOverflow?.y;

    if (isShouldScrollYShown && typeof isScrollable.y === 'object') {
      const $customStyles = isScrollable.y.$customStyles;
      const scrollWidth = isScrollable.y.scrollWidth ?? DEFAULT_SCROLL_WIDTH;
      return css`
        ${typeof $customStyles === 'function' ? $customStyles(css) : $customStyles}

        &::-webkit-scrollbar {
          width: ${$customStyles && scrollWidth}px;
        }
      `;
    }
  };

  return css`
    tbody {
      overflow-x: ${isXScrollEnabled && 'scroll'};
      overflow-y: ${isYScrollEnabled && 'scroll'};

      & tr:last-of-type > td {
        border-bottom-width: ${isContentOverflow?.y && 0};
      }

      // custom scroll Y styling
      ${setCustomYScrollStyle()}
    }
  `;
};
const defaultScrollStyle = css`
  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.color.gray200};

    border-bottom-right-radius: 8px;
  }
  &::-webkit-scrollbar-thumb {
    width: 4px;
    background: ${({ theme }) => theme.color.gray500};
    border: 4px solid rgba(0, 0, 0, 0);
    border-radius: 8px;
    background-clip: padding-box;
  }
`;
