import { BaseMapper } from 'equipped'

import { ClassEntity } from '../../domain/entities/classes'
import type { ClassFromModel, ClassToModel } from '../models/classes'

export class ClassMapper extends BaseMapper<ClassFromModel, ClassToModel, ClassEntity> {
	mapFrom(param: ClassFromModel | null) {
		return !param
			? null
			: new ClassEntity({
					id: param._id.toString(),
					organizationId: param.organizationId,
					title: param.title,
					description: param.description,
					photo: param.photo,
					user: param.user,
					frozen: param.frozen,
					price: param.price,
					lessons: param.lessons,
					members: param.members,
					createdAt: param.createdAt,
					updatedAt: param.updatedAt,
				})
	}

	mapTo(param: ClassEntity) {
		return {
			organizationId: param.organizationId,
			title: param.title,
			description: param.description,
			photo: param.photo,
			user: param.user,
			frozen: param.frozen,
			price: param.price,
		}
	}
}
