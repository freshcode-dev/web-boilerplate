type ResolveFn = (value?: unknown) => void;

export const requestLock = async (name: string) => new Promise<ResolveFn>(((resolve) => {
		let holderResolve: ResolveFn;
		const holder = new Promise(res => (holderResolve = res));

		navigator.locks.request(name, async () => {
			resolve(holderResolve);

			return holder;
		});
	}));
