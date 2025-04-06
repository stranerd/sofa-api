import type { QueryParams, QueryResults } from 'equipped'

import type { TransactionToModel } from '../../data/models/transactions'
import type { TransactionEntity } from '../entities/transactions'

export interface ITransactionRepository {
	create: (data: TransactionToModel) => Promise<TransactionEntity>
	get: (query: QueryParams) => Promise<QueryResults<TransactionEntity>>
	find: (id: string) => Promise<TransactionEntity | null>
	update: (id: string, data: Partial<TransactionToModel>) => Promise<TransactionEntity | null>
	delete: (ids: string[]) => Promise<boolean>
}
