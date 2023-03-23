export * from './purchases'
import { CronTypes, Enum } from 'equipped'
import { PurchaseToModel } from '../../data/models/purchases'

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
	purchase = 'purchase'
}

export type TransactionData = {
	type: TransactionType.newCard
} | {
	type: TransactionType.subscription
	subscriptionId: string
} | {
	type: TransactionType.purchase
	purchase: PurchaseToModel
}

export type SubscriptionModel = {
	active: boolean
	current: {
		id: string
		activatedAt: number
		expiredAt: number
		jobId: string
	} | null
	next: {
		id: string
		renewedAt: number
	} | null
	data: PlanData
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

export type Interval = Enum<typeof CronTypes>