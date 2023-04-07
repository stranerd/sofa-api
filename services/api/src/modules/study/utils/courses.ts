import { Purchasables, PurchasesUseCases } from '@modules/payment'
import { FilesUseCases, QuizzesUseCases } from '..'
import { Coursable } from '../domain/types'

const finders = {
	[Coursable.quiz]: QuizzesUseCases,
	[Coursable.file]: FilesUseCases,
}

type Type<T extends Coursable> = Awaited<ReturnType<typeof finders[T]['find']>>

export const canAccessCoursable = async<T extends Coursable> (type: T, coursableId: string, userId: string): Promise<Type<T> | null> => {
	const [coursable, purchase] = await Promise.all([
		finders[type]?.find(coursableId),
		PurchasesUseCases.for({ userId, type: Purchasables.courses, itemId: coursableId })
	])
	return (purchase || coursable?.user.id === userId) ? coursable as any : null
}