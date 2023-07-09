import { CoursesUseCases, DraftStatus } from '@modules/study'
import { Purchasables, Saleable } from '../domain/types'

type Purchable = Saleable & {
	id: string
	userId: string
	title: string
}

export const findPurchasable = async (type: Purchasables, id: string): Promise<Purchable | null> => {
	if (type === Purchasables.courses) {
		const course = await CoursesUseCases.find(id)
		if (!course || course.status !== DraftStatus.published) return null
		return { ...course, userId: course.user.id }
	}

	return null
}