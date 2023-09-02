import { BaseMapper } from 'equipped'
import { TutorRequestEntity } from '../../domain/entities/tutorRequests'
import { TutorRequestFromModel, TutorRequestToModel } from '../models/tutorRequests'

export class TutorRequestMapper extends BaseMapper<TutorRequestFromModel, TutorRequestToModel, TutorRequestEntity> {
	mapFrom (param: TutorRequestFromModel | null) {
		return !param ? null : new TutorRequestEntity({
			id: param._id.toString(),
			tutor: param.tutor,
			userId: param.userId,
			conversationId: param.conversationId,
			message: param.message,
			pending: param.pending,
			accepted: param.accepted,
			createdAt: param.createdAt,
			updatedAt: param.updatedAt
		})
	}

	mapTo (param: TutorRequestEntity) {
		return {
			tutor: param.tutor,
			userId: param.userId,
			conversationId: param.conversationId,
			message: param.message,
		}
	}
}