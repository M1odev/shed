import { useState, useRef, useCallback } from "react";

export const useTimer = () => {
  const [elapsed, setElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);
  const startTimeRef = useRef(0);

  const start = useCallback(() => {
    if (isRunning) return;

    setIsRunning(true);
    startTimeRef.current = Date.now() - elapsed;

    intervalRef.current = setInterval(() => {
      setElapsed(Date.now() - startTimeRef.current);
    }, 100);
  }, [isRunning, elapsed]);

  const pause = useCallback(() => {
    if (!isRunning) return;

    setIsRunning(false);
    clearInterval(intervalRef.current);
  }, [isRunning]);

  const reset = useCallback(() => {
    setIsRunning(false);
    clearInterval(intervalRef.current);
    setElapsed(0);
  }, []);

  return {
    elapsed,
    isRunning,
    start,
    pause,
    reset,
  };
};
