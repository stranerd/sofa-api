import { BaseMapper } from 'equipped'
import { GameEntity } from '../../domain/entities/games'
import { GameFromModel, GameToModel } from '../models/games'

export class GameMapper extends BaseMapper<GameFromModel, GameToModel, GameEntity> {
	mapFrom (model: GameFromModel | null) {
		if (!model) return null
		const { _id, quizId, user, participants, questions, createdAt, updatedAt } = model
		return new GameEntity({
			id: _id.toString(), quizId, user, participants, questions, createdAt, updatedAt
		})
	}

	mapTo (entity: GameEntity) {
		return {
			quizId: entity.quizId,
			user: entity.user,
			questions: entity.questions
		}
	}
}