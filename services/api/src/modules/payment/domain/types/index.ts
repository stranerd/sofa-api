export * from './purchases'
export * from './subscriptions'
import { CronTypes, Enum } from 'equipped'
import { PurchaseToModel } from '../../data/models/purchases'
import { Subscription } from './subscriptions'

export enum Currencies {
	NGN = 'NGN'
}

export enum TransactionStatus {
	initialized = 'initialized',
	fulfilled = 'fulfilled',
	failed = 'failed',
	settled = 'settled'
}

export enum TransactionType {
	newCard = 'newCard',
	subscription = 'subscription',
	genericSubscription = 'genericSubscription',
	purchase = 'purchase',
	purchased = 'purchased',
	sent = 'sent',
	received = 'received',
	fundWallet = 'fundWallet',
	withdrawal = 'withdrawal',
	withdrawalRefund = 'withdrawalRefund'
}

export type TransactionData = {
	type: TransactionType.newCard
} | {
	type: TransactionType.subscription
	subscriptionId: string
	multiplier: number
} | {
	type: TransactionType.genericSubscription
	data: Subscription['data']
} | {
	type: TransactionType.purchase
	purchase: PurchaseToModel
} | {
	type: TransactionType.purchased
	purchaseId: string
	userId: string
	serviceCharge: number
	purchasedType: PurchaseToModel['data']['type']
	purchasedId: PurchaseToModel['data']['id']
} | {
	type: TransactionType.sent,
	note: string
	to: string
} | {
	type: TransactionType.received,
	note: string
	from: string
} | {
	type: TransactionType.fundWallet
} | {
	type: TransactionType.withdrawal,
	withdrawalId: string
} | {
	type: TransactionType.withdrawalRefund,
	withdrawalId: string
}

export type SubscriptionModel = {
	active: boolean
	current: {
		id: string
		activatedAt: number
		expiredAt: number
		jobId: string | null
	} | null
	next: {
		id: string
		renewedAt: number
	} | null
	data: PlanData
	membersDays: number
}

export enum PlanDataType {
	tutorAidedConversations = 'tutorAidedConversations'
}

export type PlanData = Record<PlanDataType, number>

export type PlanFeatures = {}

export enum MethodType {
	card = 'card'
}

export type MethodData = {
	type: MethodType.card
	last4Digits: string
	country: string
	cardType: string
	expiredAt: number
	expired: boolean
}

export type Interval = Enum<Pick<typeof CronTypes, 'monthly' | 'weekly'>>

export type TransferData = {
	from: string,
	to: string,
	fromEmail: string,
	toEmail: string,
	amount: number,
	note: string
}

export type WithdrawData = {
	userId: string,
	email: string,
	amount: number,
	account: AccountDetails
}

export enum CurrencyCountries {
	NG = 'NG'
}

export type AccountDetails = {
	country: CurrencyCountries
	bankNumber: string
	bankCode: string
	bankName: string
	ownerName: string
}

export enum WithdrawalStatus {
	created = 'created',
	inProgress = 'inProgress',
	failed = 'failed',
	completed = 'completed',
	refunded = 'refunded',
}