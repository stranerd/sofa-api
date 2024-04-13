import { Validation } from 'equipped'

export const compareArrayContents = <T extends string | number>(arr1: T[], arr2: T[]): boolean => {
	if (arr1.length !== arr2.length) return false
	const sorted1 = [...new Set(arr1)].sort()
	const sorted2 = [...new Set(arr2)].sort()
	return Validation.Differ.equal(sorted1, sorted2)
}
