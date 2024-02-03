import { Validation } from 'equipped'

export type Ratings = {
	total: number
	count: number
	avg: number
}

export function makeSet<T>(arr: T[], keyFn: (val: T) => string) {
	return Validation.groupBy(arr, keyFn).map((g) => g.values[0])
}
