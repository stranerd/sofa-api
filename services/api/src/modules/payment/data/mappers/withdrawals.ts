import { BaseMapper } from 'equipped'
import { WithdrawalEntity } from '../../domain/entities/withdrawals'
import { WithdrawalFromModel, WithdrawalToModel } from '../models/withdrawals'

export class WithdrawalMapper extends BaseMapper<WithdrawalFromModel, WithdrawalToModel, WithdrawalEntity> {
	mapFrom (param: WithdrawalFromModel | null) {
		return !param ? null : new WithdrawalEntity({
			id: param._id.toString(),
			userId: param.userId,
			amount: param.amount,
			status: param.status,
			createdAt: param.createdAt,
			updatedAt: param.updatedAt
		})
	}

	mapTo (param: WithdrawalEntity) {
		return {
			userId: param.userId,
			amount: param.amount,
			status: param.status
		}
	}
}