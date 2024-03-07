import { BaseEntity } from 'equipped'
import { Currencies, TransactionData, TransactionStatus, TransactionType } from '../types'

export class TransactionEntity extends BaseEntity<TransactionConstructorArgs> {
	constructor(data: TransactionConstructorArgs) {
		super(data)
	}

	get originalAmount() {
		if (this.data.type === TransactionType.purchased || this.data.type === TransactionType.classSubscriptionPayment)
			return Number((this.amount / (1 - this.data.serviceCharge)).toFixed(2))
		return this.amount
	}

	get serviceAmount() {
		return this.originalAmount - this.amount
	}

	get label() {
		if (this.data.type === TransactionType.newCard) return 'New Payment Method'
		if (this.data.type === TransactionType.subscription) return 'Subscription'
		if (this.data.type === TransactionType.genericSubscription) return `${this.data.data.type} Subscription`
		if (this.data.type === TransactionType.classSubscriptionPayment) return `Class Subscription Payment`
		if (this.data.type === TransactionType.purchase) return 'New Purchase'
		if (this.data.type === TransactionType.purchased) return 'Item Sold'
		if (this.data.type === TransactionType.sent) return 'Transfer sent'
		if (this.data.type === TransactionType.received) return 'Transfer received'
		if (this.data.type === TransactionType.fundWallet) return 'Wallet funding'
		if (this.data.type === TransactionType.withdrawal) return 'Withdrawal'
		if (this.data.type === TransactionType.withdrawalRefund) return 'Refund Failed Withdrawal'
		return this.title
	}
}

type TransactionConstructorArgs = {
	id: string
	userId: string
	email: string
	title: string
	amount: number
	currency: Currencies
	status: TransactionStatus
	data: TransactionData
	createdAt: number
	updatedAt: number
}
