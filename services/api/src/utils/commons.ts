export type Ratings = {
	total: number
	count: number
	avg: number
}

export function makeSet<T>(arr: T[], keyFn: (val: T) => string) {
	return arr.reduce(
		(acc, val) => {
			const key = keyFn(val)
			if (acc.keys[key]) return acc
			acc.keys[key] = true
			acc.values.push(val)
			return acc
		},
		{ values: [] as T[], keys: {} as Record<string, boolean> },
	).values
}
