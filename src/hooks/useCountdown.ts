import { useState, useEffect } from 'react';

export const useCountdown = (initialSeconds: number = 30) => {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds(seconds => seconds - 1);
      }, 1000);
    } else if (seconds === 0) {
      setIsActive(false);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, seconds]);

  const start = (customSeconds?: number) => {
    setSeconds(customSeconds || initialSeconds);
    setIsActive(true);
  };

  const stop = () => {
    setIsActive(false);
  };

  const reset = () => {
    setSeconds(initialSeconds);
    setIsActive(false);
  };

  return { seconds, isActive, start, stop, reset };
};
