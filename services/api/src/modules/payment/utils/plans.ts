import { MembersUseCases } from '@modules/organizations'
import { UserType } from '@modules/users'
import { CronTypes } from 'equipped'
import { WalletsUseCases } from '..'
import { PlanToModel } from '../data/models/plans'
import { Currencies } from '../domain/types'

export const getPlansList = (): PlanToModel[] => [
	{
		_id: 'premium-plan',
		amount: 1500,
		currency: Currencies.NGN,
		title: 'Stranerd Plus',
		interval: CronTypes.monthly,
		data: { tutorAidedConversations: 3 },
		usersFor: Object.values(UserType).filter((type) => type !== UserType.organization),
		active: true,
	},
	{
		_id: 'organization-plan',
		amount: 500,
		currency: Currencies.NGN,
		title: 'Stranerd Suite',
		interval: CronTypes.monthly,
		data: { tutorAidedConversations: 0 },
		usersFor: [UserType.organization],
		active: true,
	},
]

export const updateOrgsMembersDays = async () => {
	const records = await MembersUseCases.aggregateMembersDays()
	await WalletsUseCases.updateMembersDays(records)
}
