import { Purchasables, PurchasesUseCases } from '@modules/payment'
import { UsersUseCases } from '@modules/users'
import { AuthRole, AuthUser } from 'equipped'
import { FilesUseCases, QuizEntity, QuizzesUseCases } from '..'
import { Coursable } from '../domain/types'
import { FileEntity } from '../domain/entities/files'
import { ClassLessonable, canAccessOrgClasses } from '@modules/organizations'
import { GamesUseCases, TestsUseCases } from '@modules/plays'

const finders = {
	[Coursable.quiz]: QuizzesUseCases,
	[Coursable.file]: FilesUseCases,
}

type Type<T extends Coursable> = Awaited<ReturnType<(typeof finders)[T]['find']>>

export const canAccessCoursable = async <T extends Coursable>(
	type: T,
	coursableId: string,
	user: AuthUser,
	access?: Record<string, string>,
): Promise<Type<T> | null> => {
	const coursable = (await finders[type]?.find(coursableId)) ?? null
	if (!coursable) return null
	// current user owns the item
	if (coursable.user.id === user.id) return coursable as Type<T>
	// current user as an admin can access tutor quizzes
	if (coursable instanceof QuizEntity && coursable.isForTutors && user.roles[AuthRole.isAdmin]) return coursable as Type<T>
	// current user has been granted access
	if (coursable instanceof QuizEntity && coursable.canUserAccess(user.id)) return coursable as Type<T>
	// item is not in a course, so it is free
	if (!coursable.courseId) return coursable as Type<T>
	// current user is subscribed to the items from stranerd official account
	if (user.roles[AuthRole.isSubscribed] && coursable.user.roles[AuthRole.isOfficialAccount]) return coursable as Type<T>
	// access checks based on query params
	const isQuiz = coursable instanceof QuizEntity
	const isFile = coursable instanceof FileEntity
	const { lessonId, classId, organizationId, testId, gameId, courseId } = access ?? {}
	if (lessonId && classId && organizationId) {
		const hasAccess = await canAccessOrgClasses(user, organizationId, classId)
		const lesson = hasAccess?.class.getLesson(lessonId)
		if (lesson) {
			const currItems = lesson.curriculum.flatMap((s) => s.items)
			if (isQuiz && currItems.find((i) => i.id === coursableId && i.type === ClassLessonable.quiz)) return coursable as Type<T>
			if (isFile && currItems.find((i) => i.id === coursableId && i.type === ClassLessonable.file)) return coursable as Type<T>
		}
	}
	if (testId && isQuiz) {
		const test = await TestsUseCases.find(testId)
		if (test && test.canUserAccess(user.id)) return coursable as Type<T>
	}
	if (gameId && isQuiz) {
		const game = await GamesUseCases.find(gameId)
		if (game && game.canUserAccess(user.id)) return coursable as Type<T>
	}
	if (courseId && coursable.courseId === courseId) {
		const purchase = await PurchasesUseCases.for({ userId: user.id, type: Purchasables.courses, itemId: courseId })
		if (purchase) return coursable as Type<T>
	}
	// check if current user has purchased item
	const purchase = await PurchasesUseCases.for({ userId: user.id, type: Purchasables.courses, itemId: coursable.courseId })
	if (purchase) return coursable as Type<T>
	const userDet = await UsersUseCases.find(user.id)
	// check that the creator is an org and the user belongs in the org, and the org is subscribed
	if (userDet) {
		const org = userDet.account.organizationsIn.find((o) => o.id === coursable.user.id)
		if (org && coursable.user.roles.isSubscribed) return coursable as Type<T>
	}
	return null
}
