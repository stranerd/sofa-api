import { UserType } from '@modules/users'
import { Currencies, Interval, PlanData } from '../../domain/types'

export interface PlanFromModel extends PlanToModel {
	createdAt: number
	updatedAt: number
}

export interface PlanToModel {
	_id: string
	amount: number
	currency: Currencies
	title: string
	interval: Interval
	active: boolean
	data: PlanData
	usersFor: UserType[]
}
