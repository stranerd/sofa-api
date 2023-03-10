import { BaseMapper } from 'equipped'
import { PlanEntity } from '../../domain/entities/plans'
import { PlanFromModel, PlanToModel } from '../models/plans'

export class PlanMapper extends BaseMapper<PlanFromModel, PlanToModel, PlanEntity> {
	mapFrom (param: PlanFromModel | null) {
		return !param ? null : new PlanEntity({
			id: param._id.toString(),
			title: param.title,
			active: param.active,
			amount: param.amount,
			currency: param.currency,
			interval: param.interval,
			data: param.data,
			createdAt: param.createdAt,
			updatedAt: param.updatedAt
		})
	}

	mapTo (param: PlanEntity) {
		return {
			_id: param.id,
			title: param.title,
			active: param.active,
			amount: param.amount,
			currency: param.currency,
			data: param.data,
			interval: param.interval
		}
	}
}