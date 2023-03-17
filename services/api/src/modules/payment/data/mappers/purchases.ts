import { BaseMapper } from 'equipped'
import { PurchaseEntity } from '../../domain/entities/purchases'
import { PurchaseFromModel, PurchaseToModel } from '../models/purchases'

export class PurchaseMapper extends BaseMapper<PurchaseFromModel, PurchaseToModel, PurchaseEntity> {
	mapFrom (param: PurchaseFromModel | null) {
		return !param ? null : new PurchaseEntity({
			id: param._id.toString(),
			user: param.user,
			price: param.price,
			data: param.data,
			createdAt: param.createdAt,
			updatedAt: param.updatedAt
		})
	}

	mapTo (param: PurchaseEntity) {
		return {
			user: param.user,
			price: param.price,
			data: param.data
		}
	}
}