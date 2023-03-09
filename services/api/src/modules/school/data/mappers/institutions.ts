import { BaseMapper } from 'equipped'
import { InstitutionEntity } from '../../domain/entities/institutions'
import { InstitutionFromModel, InstitutionToModel } from '../models/institutions'

export class InstitutionMapper extends BaseMapper<InstitutionFromModel, InstitutionToModel, InstitutionEntity> {
	mapFrom (model: InstitutionFromModel | null) {
		if (!model) return null
		const { _id, name, isGateway, createdAt, updatedAt } = model
		return new InstitutionEntity({
			id: _id.toString(), name, isGateway, createdAt, updatedAt
		})
	}

	mapTo (entity: InstitutionEntity) {
		return {
			name: entity.name,
			isGateway: entity.isGateway
		}
	}
}