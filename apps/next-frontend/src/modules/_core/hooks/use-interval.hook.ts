import { useEffect, useRef } from 'react';

type TickCallback = () => void;

export function useInterval<T = TickCallback>(callback: T, delay: number) {
	const savedCallback = useRef<T>();

	// Remember the latest callback.
	useEffect(() => {
		savedCallback.current = callback;
	}, [callback]);

	// Set up the interval.
	useEffect(() => {
		function tick() {
			if (savedCallback.current) {
				(savedCallback.current as TickCallback)();
			}
		}

		if (delay !== null) {
			const id = setInterval(tick, delay);

			return () => {
				clearInterval(id);
			};
		}

		return () => {};
	}, [delay]);
}
