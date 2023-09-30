import { useEffect, useState } from "react";

function formatSecondsToTime(totalSeconds: number) {
  const totalMs = totalSeconds * 1000;
  const result = new Date(totalMs).toISOString().slice(11, 19);
  return result;
}

/**
 *
 * @param isIdle when true, the timer will be reset to 0
 * @param isFinished when true, the timer will be reset to 0
 * @returns a string representing the elapsed time in the format HH:MM:SS
 */
export function useElapsedTime(params: {
  isIdle: boolean;
  isFinished: boolean;
}): string {
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (params.isIdle) setElapsedTime(0);
    if (!params.isIdle && !params.isFinished) {
      timeout = setTimeout(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    }
    if (params.isFinished) setElapsedTime(0);
    return () => clearTimeout(timeout);
  }, [params]);

  return formatSecondsToTime(elapsedTime);
}
