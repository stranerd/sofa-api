import { BaseEntity } from 'equipped'
import { PurchaseData, Saleable } from '../types'

export class PurchaseEntity extends BaseEntity<PurchaseConstructorArgs> {
	constructor(data: PurchaseConstructorArgs) {
		super(data)
	}

	static serviceCharge = 0.2
}

type PurchaseConstructorArgs = {
	id: string
	price: Saleable['price']
	userId: string
	data: PurchaseData
	createdAt: number
	updatedAt: number
}
