'use client';

import styled, { css } from 'styled-components';

const center = css`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const getHeaderHeight = (height: string | number, noHeader?: boolean) =>
  noHeader ? '0rem' : typeof height === 'number' ? `${height}rem` : height;

export const LayoutWrapper = styled.div<{ noHeader?: boolean }>`
  ${({ noHeader }) => css`
    --header-height: ${getHeaderHeight(6, noHeader)};

    @media screen and (min-width: 768px) {
      --header-height: ${getHeaderHeight(8, noHeader)};
    }

    @media screen and (min-width: 992px) {
      --header-height: ${getHeaderHeight(10, noHeader)};
    }
  `}

  min-width: 100vw;
  min-height: 100vh;
  width: 100%;
  height: 100%;
  background-color: pink;
`;

export const Header = styled.header`
  width: 100%;
  height: var(--header-height);
  background-color: cornflowerblue;
  color: white;
  font-size: 3.5rem;

  ${center}
`;

export const Aside = styled.aside`
  width: 10rem;
  height: calc(100vh - var(--header-height));
  background-color: coral;
  float: left;

  color: white;
  font-size: 3.5rem;

  ${center}

  @media screen and (max-width:458px) {
    display: none;
  }
`;

export const Main = styled.main`
  width: 100%;
  height: calc(100vh - var(--header-height));
  background-color: lightblue;
`;
