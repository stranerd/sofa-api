import { UserType } from '@modules/users'
import { BadRequestError, BaseEntity, CronTypes } from 'equipped'
import { Currencies, Interval, PlanData } from '../types'

export class PlanEntity extends BaseEntity<PlanConstructorArgs> {
	constructor(data: PlanConstructorArgs) {
		super(data)
	}

	getLengthInDays() {
		if (this.interval === CronTypes.weekly) return 7
		if (this.interval === CronTypes.monthly) return 30
		throw new BadRequestError('Not implemented')
	}
}

type PlanConstructorArgs = {
	id: string
	title: string
	description: string
	features: string[]
	amount: number
	active: boolean
	currency: Currencies
	interval: Interval
	data: PlanData
	usersFor: UserType[]
	createdAt: number
	updatedAt: number
}
