import { EmbeddedUser, PurchaseData, Saleable } from '../../domain/types'

export interface PurchaseFromModel extends PurchaseToModel {
	_id: string
	createdAt: number
	updatedAt: number
}

export interface PurchaseToModel {
	price: Saleable['price']
	user: EmbeddedUser
	data: PurchaseData
}