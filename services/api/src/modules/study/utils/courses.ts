import { Purchasables, PurchasesUseCases } from '@modules/payment'
import { UsersUseCases } from '@modules/users'
import { AuthRole, AuthUser } from 'equipped'
import { FilesUseCases, QuizEntity, QuizzesUseCases } from '..'
import { Coursable, DraftStatus } from '../domain/types'

const finders = {
	[Coursable.quiz]: QuizzesUseCases,
	[Coursable.file]: FilesUseCases,
}

type Type<T extends Coursable> = Awaited<ReturnType<typeof finders[T]['find']>>

export const canAccessCoursable = async<T extends Coursable> (type: T, coursableId: string, user: AuthUser): Promise<Type<T> | null> => {
	const coursable = await finders[type]?.find(coursableId) ?? null
	if (!coursable) return null
	// current user as an admin can access tutor quizzes
	if (coursable instanceof QuizEntity && coursable.isForTutors && user.roles[AuthRole.isAdmin]) return coursable as Type<T>
	// current user owns the item
	if (coursable.user.id === user.id) return coursable as Type<T>
	// current user has been granted access
	if (coursable instanceof QuizEntity && coursable.access.members.includes(user.id)) return coursable as Type<T>
	// owner of the item has not published yet
	if (coursable.status === DraftStatus.draft) return null
	// item is not in a course, so it is free
	if (!coursable.courseId) return coursable as Type<T>
	// current user is subscribed to the items from stranerd official account
	if (user.roles[AuthRole.isSubscribed] && coursable.user.roles[AuthRole.isOfficialAccount]) return coursable as Type<T>
	// check if current user has purchased item
	const purchase = await PurchasesUseCases.for({ userId: user.id, type: Purchasables.courses, itemId: coursable.courseId })
	if (purchase) return coursable as Type<T>
	const userDet = await UsersUseCases.find(user.id)
	// check that the creator is an org and the user belongs in the org
	if (!userDet || !userDet.account.organizationsIn.includes(coursable.user.id)) return null
	// allow user to access if the org is subscribed
	if (coursable.user.roles.isSubscribed) return coursable as Type<T>
	return null
}