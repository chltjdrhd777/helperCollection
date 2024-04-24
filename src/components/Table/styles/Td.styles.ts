import styled from 'styled-components';
import { TdProps } from '../Components/Td';

export const StyledTd = styled.td<TdProps>`
  font-size: 14px;
  font-weight: 400;
  line-height: 146%;

  color: ${({ theme }) => theme.color.gray800};

  min-width: ${({ width }) => width}px;
  max-width: ${({ width }) => width}px;

  ${({ $customStyles }) => $customStyles};
`;
