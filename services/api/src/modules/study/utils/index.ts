import { Purchasables, PurchasesUseCases } from '@modules/payment'
import { QuizzesUseCases } from '..'
import { Coursable } from '../domain/types'

export const compareArrayContents = <T extends string | number> (arr1: T[], arr2: T[]): boolean => {
	if (arr1.length !== arr2.length) return false
	const sorted1 = arr1.sort()
	const sorted2 = arr2.sort()
	for (let i = 0; i < sorted1.length; i++) {
		if (sorted1[i] !== sorted2[i]) return false
	}
	return true
}

const finders = {
	[Coursable.quiz]: QuizzesUseCases
}

export const canAccessCoursable = async (type: Coursable, coursableId: string, userId: string) => {
	const [coursable, purchase] = await Promise.all([
		finders[type]?.find(coursableId),
		PurchasesUseCases.for({ userId, type: Purchasables.courses, itemId: coursableId })
	])
	return !!purchase || coursable?.user.id === userId
}