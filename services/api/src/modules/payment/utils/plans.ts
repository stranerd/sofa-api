import { CronTypes } from 'equipped'
import { PlanToModel } from '../data/models/plans'
import { Currencies } from '../domain/types'

export const plansList: PlanToModel[] = [
	{
		_id: 'premium-plan',
		amount: 2000,
		currency: Currencies.NGN,
		name: 'Premium',
		interval: CronTypes.monthly,
		data: {},
		active: true
	}
]