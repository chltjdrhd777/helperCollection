import styled, { css } from 'styled-components';
import { ThProps } from '../Components/Th';

export const StyledTh = styled.th<ThProps>`
  color: ${({ theme }) => theme.color.gray800};

  min-width: ${({ width }) => width}px;
  max-width: ${({ width }) => width}px;

  & .th-contents {
    font-size: 14px;
    font-weight: 500;
    line-height: 146%;

    display: flex;
    justify-content: space-between;
  }

  // conditional styling (클래스로 하는 이유 = 후에 자유로운 스타일링 위함)
  &.isCurrentSortIdx {
    ${css`
      transition: all 0.3s ease-in;
      background-color: #e8e6e6;
    `}
  }

  ${({ $customStyles }) => $customStyles};
`;
