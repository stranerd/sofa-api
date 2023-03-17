import { EmbeddedUser, PurchaseData, Saleable } from '../../domain/types'

export interface PurchaseFromModel extends PurchaseToModel {
	_id: string
	createdAt: number
	updatedAt: number
}

export interface PurchaseToModel extends Saleable {
	user: EmbeddedUser
	data: PurchaseData
}