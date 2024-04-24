import styled from 'styled-components';

export const LoadingContainer = styled.div`
  & {
    --loading-spinner-zindex: 20;
    --loading-overlay-zindex: 10;
    --overlay-background: #fff;
  }

  width: inherit;
  height: inherit;
  position: relative;
`;

export const Spinner = styled.div`
  width: 100%;
  height: 100%;

  position: absolute;
  z-index: var(--loading-spinner-zindex);

  display: flex;
  justify-content: center;
  align-items: center;
`;

export const SpinnerRounds = styled.div`
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;

  & .spinner-round {
    animation: lds-roller 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
    transform-origin: 40px 40px;
  }
  & .spinner-round:after {
    content: ' ';
    display: block;
    position: absolute;
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: radial-gradient(circle, #64d8fa, transparent);
    margin: -4px 0 0 -4px;
  }

  & .spinner-round:nth-child(1) {
    animation-delay: -0.036s;
  }
  & .spinner-round:nth-child(1):after {
    top: 63px;
    left: 63px;
  }

  & .spinner-round:nth-child(2) {
    animation-delay: -0.072s;
  }
  & .spinner-round:nth-child(2):after {
    top: 68px;
    left: 56px;
  }

  & .spinner-round:nth-child(3) {
    animation-delay: -0.108s;
  }
  & .spinner-round:nth-child(3):after {
    top: 71px;
    left: 48px;
  }

  & .spinner-round:nth-child(4) {
    animation-delay: -0.144s;
  }
  & .spinner-round:nth-child(4):after {
    top: 72px;
    left: 40px;
  }

  & .spinner-round:nth-child(5) {
    animation-delay: -0.18s;
  }
  & .spinner-round:nth-child(5):after {
    top: 71px;
    left: 32px;
  }

  & .spinner-round:nth-child(6) {
    animation-delay: -0.216s;
  }
  & .spinner-round:nth-child(6):after {
    top: 68px;
    left: 24px;
  }

  & .spinner-round:nth-child(7) {
    animation-delay: -0.252s;
  }
  & .spinner-round:nth-child(7):after {
    top: 63px;
    left: 17px;
  }

  & .spinner-round:nth-child(8) {
    animation-delay: -0.288s;
  }
  & .spinner-round:nth-child(8):after {
    top: 56px;
    left: 12px;
  }

  @keyframes lds-roller {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

export const LoadingOverlay = styled.div`
  width: 100%;
  height: 100%;

  position: absolute;
  top: 0;
  left: 0;
  z-index: var(--loading-overlay-zindex);

  background-color: var(--overlay-background);
  opacity: 0.57;
`;
