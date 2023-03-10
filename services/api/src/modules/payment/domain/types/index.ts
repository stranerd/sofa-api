import { CronTypes, Enum } from 'equipped'

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
	NewCard = 'NewCard',
	Subscription = 'Subscription',
	BestAnswer = 'BestAnswer'
}

type TransactionNewCard = {
	type: TransactionType.NewCard
}

type TransactionSubscription = {
	type: TransactionType.Subscription
	subscriptionId: string
}

type TransactionBestAnswer = {
	type: TransactionType.BestAnswer
	answerId: string
	questionId: string
}

export type TransactionData = TransactionNewCard | TransactionSubscription | TransactionBestAnswer

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

export enum PlanDataType {}

export type PlanData = Record<PlanDataType, number> | {}

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