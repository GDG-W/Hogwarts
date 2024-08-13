import { DependencyList, useEffect, useRef } from 'react';

type CallbackFunction = () => void;

const useVisibilityInterval = (
  callback: CallbackFunction,
  delay: number,
  deps: DependencyList,
): void => {
  const isIntervalRunning = useRef<boolean>(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startInterval = () => {
    if (!isIntervalRunning.current) {
      intervalRef.current = setInterval(callback, delay);
      isIntervalRunning.current = true;
    }
  };

  const stopInterval = () => {
    if (isIntervalRunning.current && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      isIntervalRunning.current = false;
    }
  };

  useEffect(() => {
    startInterval();

    const handleVisibilityChange = () => {
      document.hidden ? stopInterval() : startInterval();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      stopInterval();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [callback, delay, ...deps]);
};

export default useVisibilityInterval;
