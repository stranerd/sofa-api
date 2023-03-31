import { Purchasables, PurchasesUseCases } from '@modules/payment'
import { QuizzesUseCases } from '..'
import { Coursable } from '../domain/types'

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