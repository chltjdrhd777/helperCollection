import React, { PropsWithChildren, ReactNode } from 'react';
import * as S from '../styles/RowLoadingSpinner.styles';

interface RowLoadingSpinnerProps {
  loadingRender?: ReactNode;
}

export default function RowLoadingSpinner({
  loadingRender,
  children,
}: PropsWithChildren<RowLoadingSpinnerProps>) {
  return (
    <S.LoadingContainer className="loading_container">
      <S.Spinner>
        {loadingRender ?? (
          <S.SpinnerRounds>
            <div className="spinner-round"></div>
            <div className="spinner-round"></div>
            <div className="spinner-round"></div>
            <div className="spinner-round"></div>
            <div className="spinner-round"></div>
            <div className="spinner-round"></div>
            <div className="spinner-round"></div>
            <div className="spinner-round"></div>
          </S.SpinnerRounds>
        )}
      </S.Spinner>

      <S.LoadingOverlay />

      {children}
    </S.LoadingContainer>
  );
}
