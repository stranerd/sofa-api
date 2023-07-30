import { BaseMapper } from 'equipped'
import { TutorRequestEntity } from '../../domain/entities/tutorRequests'
import { TutorRequestFromModel, TutorRequestToModel } from '../models/tutorRequests'

export class TutorRequestMapper extends BaseMapper<TutorRequestFromModel, TutorRequestToModel, TutorRequestEntity> {
	mapFrom (param: TutorRequestFromModel | null) {
		return !param ? null : new TutorRequestEntity({
			id: param._id.toString(),
			userId: param.userId,
			topicId: param.topicId,
			verification: param.verification,
			qualification: param.qualification,
			pending: param.pending,
			accepted: param.accepted,
			createdAt: param.createdAt,
			updatedAt: param.updatedAt
		})
	}

	mapTo (param: TutorRequestEntity) {
		return {
			userId: param.userId,
			pending: param.pending,
			accepted: param.accepted,
			topicId: param.topicId,
			verification: param.verification,
			qualification: param.qualification,
		}
	}
}