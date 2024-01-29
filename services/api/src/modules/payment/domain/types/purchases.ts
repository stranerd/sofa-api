import { Currencies } from '.'

export type Saleable = {
	frozen: boolean
	price: {
		amount: number
		currency: Currencies
	}
}

export enum Purchasables {
	courses = 'courses',
}

export type PurchaseData = {
	type: Purchasables
	id: string
	userId: string
}
