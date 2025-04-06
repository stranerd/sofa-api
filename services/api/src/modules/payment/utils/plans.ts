import { CronTypes } from 'equipped'

import { MembersUseCases } from '@modules/organizations'
import { UserType } from '@modules/users'

import { WalletsUseCases } from '..'
import type { PlanToModel } from '../data/models/plans'
import { Currencies } from '../domain/types'

const studentFeatures = [
	'Unlimited access to our Nerd AI',
	'Create and study with unlimited quizzes, flashcards, and practice tests',
	'Multiplayer quiz games with friends',
	'Access to our academic marketplace',
	'Access to unlimited number of classes(JAMB, WAEC, SAT, etc)',
]

const orgFeatures = ['Students have access to all created materials and resources by your organization']

export const getPlansList = (): PlanToModel[] => [
	{
		_id: 'free-basic-plan',
		amount: 0,
		currency: Currencies.NGN,
		title: 'Nerd Basic',
		description: 'Nerd basic is a free plan  for students to have access to unlimited resources',
		features: studentFeatures,
		interval: CronTypes.monthly,
		data: { tutorAidedConversations: 0 },
		usersFor: Object.values(UserType).filter((type) => type !== UserType.organization),
		active: true,
	},
	{
		_id: 'premium-plan',
		amount: 2500,
		currency: Currencies.NGN,
		title: 'Nerd Plus',
		description: 'Nerd Plus is a premium plan  for students to have access to unlimited resources',
		features: [...studentFeatures, '3 Tutoring sesions(Hybrid)', 'Access to all Stranerd created content'],
		interval: CronTypes.monthly,
		data: { tutorAidedConversations: 3 },
		usersFor: Object.values(UserType).filter((type) => type !== UserType.organization),
		active: true,
	},
	{
		_id: 'organization-plan-free',
		amount: 0,
		currency: Currencies.NGN,
		title: 'Nerd Suite Plus',
		description: 'Nerd suite is a free plan for organizations to manage students',
		features: orgFeatures,
		interval: CronTypes.monthly,
		data: { tutorAidedConversations: 0 },
		usersFor: [UserType.organization],
		active: true,
	},
	{
		_id: 'organization-plan',
		amount: 1500,
		currency: Currencies.NGN,
		title: 'Nerd Suite',
		description: 'Nerd suite is a plan for organizations to have access to unlimited resources',
		features: [
			...orgFeatures,
			'Access to live classes',
			'Students have access to class recordings all materials associated with that class.',
		],
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
