import { QueryParams, QueryResults } from 'equipped'
import { WithdrawalEntity } from '../entities/withdrawals'

export interface IWithdrawalRepository {
	get: (query: QueryParams) => Promise<QueryResults<WithdrawalEntity>>
	find: (id: string) => Promise<WithdrawalEntity | null>
	delete: (id: string, userId: string) => Promise<boolean>
}
