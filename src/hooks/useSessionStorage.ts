import { useEffect, useState } from "react";

export function useSessionStorage<T>(key: string, initial: T) {
	const [value, setValue] = useState<T>(initial);

	useEffect(() => {
		try {
			const raw = window.sessionStorage.getItem(key);
			if (raw) {
				setValue(JSON.parse(raw) as T);
			}
		} catch {}
	}, [key]);

	useEffect(() => {
		try {
			window.sessionStorage.setItem(key, JSON.stringify(value));
		} catch {}
	}, [key, value]);

	return [value, setValue] as const;
}
