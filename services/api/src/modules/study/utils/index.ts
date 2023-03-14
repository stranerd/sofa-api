import { QuizzesUseCases } from '..'
import { Coursable, DraftStatus } from '../domain/types'

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
	const coursable = await finders[type]?.find(coursableId) ?? null
	if (!coursable) return false
	if (coursable.user.id === userId) return true
	if (coursable.status === DraftStatus.draft) return false
	if (!coursable.courseId) return true
	// TODO: check  if user has paid for this coursable's course
	return !!userId
}