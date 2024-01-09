import React, { PropsWithChildren, createContext, useContext as useReactContext } from 'react';

export default function contextStore<ContextValue>() {
  const context = createContext<ContextValue | null>(null);

  const useContext = (message?: string) => {
    const contextValue = useReactContext(context);

    if (contextValue === null) {
      throw new Error(message ?? 'useContext는 Provider 안에서 사용해야 합니다.');
    }

    return contextValue;
  };

  const Provider = ({ value, children }: PropsWithChildren<{ value: ContextValue }>) => (
    <context.Provider value={value}>{children}</context.Provider>
  );

  return {
    context,
    useContext,
    Provider,
  };
}
