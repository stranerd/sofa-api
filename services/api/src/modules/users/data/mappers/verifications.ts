import { BaseMapper } from 'equipped'
import { VerificationEntity } from '../../domain/entities/verifications'
import { VerificationFromModel, VerificationToModel } from '../models/verifications'

export class VerificationMapper extends BaseMapper<VerificationFromModel, VerificationToModel, VerificationEntity> {
	mapFrom (param: VerificationFromModel | null) {
		return !param ? null : new VerificationEntity({
			id: param._id.toString(),
			userId: param.userId,
			content: param.content,
			pending: param.pending,
			accepted: param.accepted,
			createdAt: param.createdAt,
			updatedAt: param.updatedAt
		})
	}

	mapTo (param: VerificationEntity) {
		return {
			userId: param.userId,
			content: param.content,
			pending: param.pending,
			accepted: param.accepted
		}
	}
}