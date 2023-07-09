import { BaseEntity } from 'equipped'
import { PurchaseData, Saleable } from '../types'

export class PurchaseEntity extends BaseEntity {
	public readonly id: string
	public readonly price: Saleable['price']
	public readonly userId: string
	public readonly data: PurchaseData
	public readonly createdAt: number
	public readonly updatedAt: number

	constructor ({
		id, userId, price, data, createdAt, updatedAt
	}: PurchaseConstructorArgs) {
		super()
		this.id = id
		this.userId = userId
		this.price = price
		this.data = data
		this.createdAt = createdAt
		this.updatedAt = updatedAt
	}
}

type PurchaseConstructorArgs = {
	id: string
	price: Saleable['price']
	userId: string
	data: PurchaseData
	createdAt: number
	updatedAt: number
}