import React, { PropsWithChildren, createContext, useContext as useReactContext } from 'react';

export default function ContextStore<ContextValue extends any>() {
  const Context = createContext<ContextValue | null>(null);

  const Provider: <Value = unknown>(props: PropsWithChildren<{ value: Value }>) => JSX.Element = ({
    value,
    children,
  }) => {
    const dependencies = value ? Object.values(value) : [];
    const memorizedValue = React.useMemo(() => value, dependencies) as ContextValue | null;

    return <Context.Provider value={memorizedValue}>{children}</Context.Provider>;
  };

  const useContext = (consumerName?: string) => {
    const contextValue = useReactContext(Context);
    if (contextValue) return contextValue;

    throw new Error(`useContext는 ${consumerName ?? 'react component'} 안에서 사용해야 합니다.`);
  };

  return {
    Context,
    useContext,
    Provider,
  };
}
