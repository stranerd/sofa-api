import { BaseEntity } from 'equipped'
import { EmbeddedUser, PurchaseData, Saleable } from '../types'

export class PurchaseEntity extends BaseEntity implements Saleable {
	public readonly id: string
	public readonly price: Saleable['price']
	public readonly user: EmbeddedUser
	public readonly data: PurchaseData
	public readonly createdAt: number
	public readonly updatedAt: number

	constructor ({
		id, user, price, data, createdAt, updatedAt
	}: PurchaseConstructorArgs) {
		super()
		this.id = id
		this.user = user
		this.price = price
		this.data = data
		this.createdAt = createdAt
		this.updatedAt = updatedAt
	}
}

type PurchaseConstructorArgs = Saleable & {
	id: string
	price: Exclude<Saleable['price'], false>
	user: EmbeddedUser
	data: PurchaseData
	createdAt: number
	updatedAt: number
}