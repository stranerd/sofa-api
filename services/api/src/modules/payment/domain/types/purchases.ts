import { Currencies } from '.'
export { EmbeddedUser } from '@modules/users'

export type Saleable = {
	price: {
		amount: number
		currency: Currencies
	} | false
}

export enum Purchasables {
	courses = 'courses',
}

export type PurchaseData = {
	type: Purchasables
	id: string
	userId: string
}