import { QueryParams, QueryResults } from 'equipped'
import { WithdrawalEntity } from '../entities/withdrawals'
import { WithdrawalToModel } from '@modules/payment/data/models/withdrawals'

export interface IWithdrawalRepository {
	get: (query: QueryParams) => Promise<QueryResults<WithdrawalEntity>>
	find: (id: string) => Promise<WithdrawalEntity | null>
	update: (id: string, data: Partial<WithdrawalToModel>) => Promise<WithdrawalEntity | null>
	delete: (id: string, userId: string) => Promise<boolean>
}