// hooks/useComponentState.ts

import { useRef } from 'react';

const useComponentState = <T extends {}>(initialState: T) => {
  const componentState = useRef<T>(initialState);

  const saveState = (state: T) => {
    componentState.current = state;
    console.error('State saved:', state); // 调试日志
  };

  const getState = () => {
    console.error('State retrieved:', componentState.current); // 调试日志
    return componentState.current;
  };

  return { saveState, getState };
};

export default useComponentState;