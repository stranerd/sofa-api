import { Purchasables, PurchasesUseCases } from '@modules/payment'
import { FilesUseCases, QuizzesUseCases } from '..'
import { Coursable, DraftStatus } from '../domain/types'

const finders = {
	[Coursable.quiz]: QuizzesUseCases,
	[Coursable.file]: FilesUseCases,
}

type Type<T extends Coursable> = Awaited<ReturnType<typeof finders[T]['find']>>

export const canAccessCoursable = async<T extends Coursable> (type: T, coursableId: string, userId: string): Promise<Type<T> | null> => {
	const coursable = await finders[type]?.find(coursableId) ?? null
	if (!coursable) return null
	if (coursable.user.id === userId) return coursable as any
	if (coursable.status === DraftStatus.draft) return null
	if (!coursable.courseId) return coursable as any
	const purchase = await PurchasesUseCases.for({ userId, type: Purchasables.courses, itemId: coursable.courseId })
	return purchase ? coursable as any : null
}