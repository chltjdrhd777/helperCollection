import styled from 'styled-components';
import { SortDirectionProps } from '../Components/ColumnSorter';

// styled
export const SortContainer = styled.span`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  gap: 2px;
`;

export const SortSVGWrapper = styled.span<SortDirectionProps>`
  display: flex;
  justify-content: center;
  align-items: center;

  transition: all 0.2s ease-in-out;
  opacity: ${({ isVisible }) => (isVisible ? 1 : 0)};
  visibility: ${({ isVisible }) => !isVisible && 'hidden'};
  transform: ${({ direction }) => direction === 'bottom' && 'rotate(180deg)'};
`;
