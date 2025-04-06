import { BaseEntity } from 'equipped'

import type { AccountDetails, Currencies, WithdrawalStatus } from '../types'

export class WithdrawalEntity extends BaseEntity<WithdrawalConstructorArgs> {
	constructor(data: WithdrawalConstructorArgs) {
		super(data)
	}

	getChargedAmount() {
		return this.amount + this.fee
	}
}

type WithdrawalConstructorArgs = {
	id: string
	userId: string
	email: string
	amount: number
	fee: number
	currency: Currencies
	status: WithdrawalStatus
	account: AccountDetails
	externalId: number | null
	createdAt: number
	updatedAt: number
}
