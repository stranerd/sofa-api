import { SelectedPaymentMethod } from './purchases'

export type Subscription = {
	active: boolean
	methodId: SelectedPaymentMethod
	current: {
		activatedAt: number
		expiredAt: number
		jobId: string | null
	} | null
	next: {
		renewedAt: number
	} | null
	data: {
		type: 'classes'
		organizationId: string
		classId: string
	}
}

export type SubscriptionModel = {
	active: boolean
	methodId: SelectedPaymentMethod
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
	tutorAidedConversations = 'tutorAidedConversations',
}

export type PlanData = Record<PlanDataType, number>

export type PlanFeatures = {}
