import { BaseMapper } from 'equipped'
import { ConnectEntity } from '../../domain/entities/connects'
import { ConnectFromModel, ConnectToModel } from '../models/connects'

export class ConnectMapper extends BaseMapper<ConnectFromModel, ConnectToModel, ConnectEntity> {
	mapFrom (param: ConnectFromModel | null) {
		return !param ? null : new ConnectEntity({
			id: param._id.toString(),
			from: param.from,
			to: param.to,
			pending: param.pending,
			accepted: param.accepted,
			createdAt: param.createdAt,
			updatedAt: param.updatedAt
		})
	}

	mapTo (param: ConnectEntity) {
		return {
			from: param.from,
			to: param.to,
			pending: param.pending,
			accepted: param.accepted
		}
	}
}