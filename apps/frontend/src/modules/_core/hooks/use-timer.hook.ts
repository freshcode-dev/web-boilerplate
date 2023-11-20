import { useCallback, useMemo, useState } from 'react';
import { useInterval } from './use-interval.hook';

type TimerEndCallback = () => void;

export function useTimer(timerEndCallback: TimerEndCallback, timerEndDelay: number, autoResetOnEnd: boolean = false) {
	const [seconds, setSeconds] = useState<number>(timerEndDelay);

	const resetTimer = useCallback(() => {
		setSeconds(timerEndDelay);
	}, [timerEndDelay]);

	useInterval(() => {
		setSeconds((sec) => {
			const newSec = sec - 1;

			if (newSec <= 0) {
				timerEndCallback();

				return autoResetOnEnd ? timerEndDelay : 0;
			}

			return newSec;
		});
	}, 1000);

	const result = useMemo(
		() => ({
			seconds,
			resetTimer,
		}),
		[resetTimer, seconds]
	);

	return result;
}
