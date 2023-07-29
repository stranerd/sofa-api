import { BaseEntity } from 'equipped'
import { WithdrawalStatus } from '../types'

export class WithdrawalEntity extends BaseEntity {
	public readonly id: string
	public readonly userId: string
	public readonly amount: number
	public readonly status: WithdrawalStatus
	public readonly createdAt: number
	public readonly updatedAt: number

	constructor ({
		id, userId, amount, status, createdAt, updatedAt
	}: WithdrawalConstructorArgs) {
		super()
		this.id = id
		this.userId = userId
		this.amount = amount
		this.status = status
		this.createdAt = createdAt
		this.updatedAt = updatedAt
	}
}

type WithdrawalConstructorArgs = {
	id: string
	userId: string
	amount: number
	status: WithdrawalStatus
	createdAt: number
	updatedAt: number
}