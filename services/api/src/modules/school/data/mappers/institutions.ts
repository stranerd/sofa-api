import { BaseMapper } from 'equipped'
import { InstitutionEntity } from '../../domain/entities/institutions'
import { InstitutionFromModel, InstitutionToModel } from '../models/institutions'

export class InstitutionMapper extends BaseMapper<InstitutionFromModel, InstitutionToModel, InstitutionEntity> {
	mapFrom (model: InstitutionFromModel | null) {
		if (!model) return null
		const { _id, title, isGateway, createdAt, updatedAt } = model
		return new InstitutionEntity({
			id: _id.toString(), title, isGateway, createdAt, updatedAt
		})
	}

	mapTo (entity: InstitutionEntity) {
		return {
			title: entity.title,
			isGateway: entity.isGateway
		}
	}
}