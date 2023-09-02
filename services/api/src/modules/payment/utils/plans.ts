import { CronTypes } from 'equipped'
import { PlanToModel } from '../data/models/plans'
import { Currencies } from '../domain/types'
import { UserType } from '@modules/users'

export const getPlansList = (): PlanToModel[] => [
	{
		_id: 'premium-plan',
		amount: 1500,
		currency: Currencies.NGN,
		title: 'Stranerd Plus',
		interval: CronTypes.monthly,
		data: { tutorAidedConversations: 3 },
		usersFor: Object.values(UserType).filter((type) => type !== UserType.organization),
		active: true
	}, {
		_id: 'organization-plan',
		amount: 500,
		currency: Currencies.NGN,
		title: 'Stranerd Suite',
		interval: CronTypes.monthly,
		data: { tutorAidedConversations: 0 },
		usersFor: [UserType.organization],
		active: true
	}
]