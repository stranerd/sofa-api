import type { AuthUser } from 'equipped'
import { AuthRole, NotAuthorizedError, Schema } from 'equipped'

import { canAccessOrgClasses } from '@modules/organizations'
import { Purchasables, PurchasesUseCases } from '@modules/payment'
import { PlayEntity, PlaysUseCases } from '@modules/plays'
import { UsersUseCases } from '@modules/users'
import { makeSet } from '@utils/commons'

import { QuizEntity } from '../domain/entities/quizzes'
import type { CourseSections } from '../domain/types'
import { Coursable, FileType, QuizModes } from '../domain/types'
import { FilesUseCases, QuizzesUseCases } from '../init'

const finders = {
	[Coursable.quiz]: QuizzesUseCases,
	[Coursable.play]: PlaysUseCases,
	[Coursable.file]: FilesUseCases,
}

type Type<T extends Coursable> = Awaited<ReturnType<(typeof finders)[T]['find']>>

type Access =
	| {
			organizationId: string
			classId: string
			lessonId: string
	  }
	| {
			courseId: string
	  }
	| Record<string, any>

export const canAccessCoursable = async <T extends Coursable>(
	type: T,
	coursableId: string,
	user: AuthUser,
	access: Record<string, string> = {},
): Promise<Type<T> | null> => {
	const coursable = (await finders[type]?.find(coursableId)) ?? null
	if (!coursable) return null
	if (coursable instanceof PlayEntity) return coursable as Type<T>
	const isQuiz = coursable instanceof QuizEntity
	// current user owns the item
	if (coursable.user.id === user.id) return coursable as Type<T>
	// current user as an admin can access tutor quizzes
	if (isQuiz && coursable.isForTutors && user.roles[AuthRole.isAdmin]) return coursable as Type<T>
	// current user has been granted access
	if (isQuiz && coursable.canUserAccess(user.id)) return coursable as Type<T>
	// item is not in a course, so it is free
	if (!coursable.courseIds.length) return coursable as Type<T>
	// current user is subscribed to the items from stranerd official account
	if (user.roles[AuthRole.isSubscribed] && coursable.user.roles[AuthRole.isOfficialAccount]) return coursable as Type<T>
	// access checks based on query params
	const { lessonId, classId, organizationId, courseId } = access
	if (lessonId && classId && organizationId) {
		const hasAccess = await canAccessOrgClasses(user, organizationId, classId)
		const lesson = hasAccess?.class.getLesson(lessonId)
		if (lesson) {
			const currItems = lesson.curriculum.flatMap((s) => s.items)
			if (currItems.find((i) => i.id === coursableId && i.type === type)) return coursable as Type<T>
		}
	}
	if (courseId && !coursable.courseIds.includes(courseId)) return null
	// check if current user has purchased course
	const purchase = await PurchasesUseCases.for({ userId: user.id, type: Purchasables.courses, itemId: courseId })
	if (purchase) return coursable as Type<T>
	const userDet = await UsersUseCases.find(user.id)
	// check that the creator is an org and the user belongs in the org, and the org is subscribed
	if (userDet) {
		const org = userDet.account.organizationsIn.find((o) => o.id === coursable.user.id)
		if (org && coursable.user.roles.isSubscribed) return coursable as Type<T>
	}
	return null
}

export const SectionsSchema = Schema.array(
	Schema.object({
		label: Schema.string().min(1),
		items: Schema.array(
			Schema.discriminate((d) => d.type, {
				[Coursable.quiz]: Schema.object({
					id: Schema.string().min(1),
					type: Schema.is(Coursable.quiz as const),
					quizMode: Schema.in(Object.values(QuizModes)),
				}),
				[Coursable.play]: Schema.object({
					id: Schema.string().min(1),
					type: Schema.is(Coursable.play as const),
					quizId: Schema.string().min(1),
					quizMode: Schema.in(Object.values(QuizModes)),
				}),
				[Coursable.file]: Schema.object({
					id: Schema.string().min(1),
					type: Schema.is(Coursable.file as const),
					fileType: Schema.in(Object.values(FileType)),
				}),
			}),
		),
	}),
)

export const verifySections = async (sections: CourseSections, user: AuthUser, access: Access) => {
	const allFiles = makeSet(
		sections.flatMap((s) => s.items.filter((i) => i.type === Coursable.file)),
		(f) => f.id,
	)
	const allQuizzes = makeSet(
		sections.flatMap((s) => s.items.filter((i) => i.type === Coursable.quiz)),
		(q) => q.id,
	)

	const allPlays = makeSet(
		sections.flatMap((s) => s.items.filter((i) => i.type === Coursable.play)),
		(q) => q.id,
	)

	await Promise.all([
		(async () => {
			const accesses = await Promise.all(
				allFiles.map(async (f) => {
					if (f.type !== Coursable.file) return null
					const file = await canAccessCoursable(Coursable.file, f.id, user, access)
					if (!file || file.type !== f.fileType) return null
					return access
				}),
			)
			if (accesses.every((a) => a)) return
			throw new NotAuthorizedError('you have some invalid files')
		})(),
		(async () => {
			const accesses = await Promise.all(allQuizzes.map((q) => canAccessCoursable(Coursable.quiz, q.id, user, access)))
			if (accesses.every((a) => a)) return
			throw new NotAuthorizedError('you have some invalid quizzes')
		})(),
		(async () => {
			const accesses = await Promise.all(
				allPlays.map(async (p) => {
					if (p.type !== Coursable.play) return null
					const play = await canAccessCoursable(Coursable.play, p.id, user, access)
					if (!play || play.quizId !== p.quizId || play.data.type !== p.quizMode) return null
					return access
				}),
			)
			if (accesses.every((a) => a)) return
			throw new NotAuthorizedError('you have some invalid files')
		})(),
	])
}
