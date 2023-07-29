import { WithdrawalStatus } from '../../domain/types'

export interface WithdrawalFromModel extends WithdrawalToModel {
	_id: string
	createdAt: number
	updatedAt: number
}

export interface WithdrawalToModel {
	userId: string
	amount: number
	status: WithdrawalStatus
}