import { Purchasables, PurchasesUseCases } from '@modules/payment'
import { FilesUseCases, QuizzesUseCases } from '..'
import { Coursable, DraftStatus } from '../domain/types'
import { AuthRole, AuthUser } from 'equipped'

const finders = {
	[Coursable.quiz]: QuizzesUseCases,
	[Coursable.file]: FilesUseCases,
}

type Type<T extends Coursable> = Awaited<ReturnType<typeof finders[T]['find']>>

export const canAccessCoursable = async<T extends Coursable> (type: T, coursableId: string, user: AuthUser): Promise<Type<T> | null> => {
	const coursable = await finders[type]?.find(coursableId) ?? null
	if (!coursable) return null
	// current user owns the item
	if (coursable.user.id === user.id) return coursable as Type<T>
	// owner of the item has not published yet
	if (coursable.status === DraftStatus.draft) return null
	// item is not in a course, so it is free
	if (!coursable.courseId) return coursable as Type<T>
	// current user is subscribed to the items from stranerd official account
	if (user.roles[AuthRole.isSubscribed] && coursable.user.roles[AuthRole.isOfficialAccount]) return coursable as Type<T>
	// check if current user has purchased item
	const purchase = await PurchasesUseCases.for({ userId: user.id, type: Purchasables.courses, itemId: coursable.courseId })
	return purchase ? coursable as Type<T> : null
}