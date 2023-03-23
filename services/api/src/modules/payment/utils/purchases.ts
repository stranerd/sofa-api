import { CoursesUseCases } from '@modules/study'
import { EmbeddedUser, Purchasables, Saleable } from '../domain/types'

type Purchable = Saleable & {
	id: string
	user: EmbeddedUser
	title: string
}

export const findPurchaseable = async (type: Purchasables, id: string): Promise<Purchable | null> => {
	if (type === Purchasables.courses) {
		return await CoursesUseCases.find(id)
	}

	return null
}