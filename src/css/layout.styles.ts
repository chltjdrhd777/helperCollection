'use client';

import styled, { css } from 'styled-components';

const center = css`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const LayoutWrapper = styled.div`
  & {
    // css vars
    --header-height: 6rem;

    @media screen and (min-width: 768px) {
      --header-height: 8rem;
    }

    @media screen and (min-width: 992px) {
      --header-height: 10rem;
    }
  }

  min-width: 100vw;
  min-height: 100vh;
  background-color: pink;
`;

export const Main = styled.main`
  width: 100%;
  height: calc(100vh - var(--header-height));
  background-color: lightblue;
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
