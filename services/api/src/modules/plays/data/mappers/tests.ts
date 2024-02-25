import { BaseMapper } from 'equipped'
import { TestEntity } from '../../domain/entities/tests'
import { TestFromModel, TestToModel } from '../models/tests'

export class TestMapper extends BaseMapper<TestFromModel, TestToModel, TestEntity> {
	mapFrom(model: TestFromModel | null) {
		if (!model) return null
		const { _id, quizId, status, user, questions, totalTimeInSec, scores, startedAt, endedAt, createdAt, updatedAt } = model
		return new TestEntity({
			id: _id.toString(),
			quizId,
			status,
			user,
			questions,
			totalTimeInSec,
			scores,
			startedAt,
			endedAt,
			createdAt,
			updatedAt,
		})
	}

	mapTo(entity: TestEntity) {
		return {
			quizId: entity.quizId,
			user: entity.user,
			questions: entity.questions,
			totalTimeInSec: entity.totalTimeInSec,
		}
	}
}
