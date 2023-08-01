import { BaseEntity, CronTypes } from 'equipped'
import { Currencies, Interval, PlanData } from '../types'
import { UserType } from '@modules/users'

export class PlanEntity extends BaseEntity {
	public readonly id: string
	public readonly title: string
	public readonly interval: Interval
	public readonly active: boolean
	public readonly amount: number
	public readonly currency: Currencies
	public readonly data: PlanData
	public readonly usersFor: UserType[]
	public readonly createdAt: number
	public readonly updatedAt: number

	constructor ({
		id,
		amount,
		currency,
		title,
		interval,
		active,
		data,
		usersFor,
		createdAt,
		updatedAt
	}: PlanConstructorArgs) {
		super()
		this.id = id
		this.title = title
		this.interval = interval
		this.active = active
		this.amount = amount
		this.currency = currency
		this.data = data
		this.usersFor = usersFor
		this.createdAt = createdAt
		this.updatedAt = updatedAt
	}

	getNextCharge (time: number) {
		const date = new Date(time)
		if (this.interval === CronTypes.hourly) date.setHours(date.getHours() + 1)
		if (this.interval === CronTypes.daily) date.setDate(date.getDate() + 1)
		if (this.interval === CronTypes.weekly) date.setDate(date.getDate() + 7)
		if (this.interval === CronTypes.monthly) date.setMonth(date.getMonth() + 1)
		return date.getTime()
	}
}

type PlanConstructorArgs = {
	id: string
	title: string
	amount: number
	active: boolean
	currency: Currencies
	interval: Interval
	data: PlanData
	usersFor: UserType[]
	createdAt: number
	updatedAt: number
}