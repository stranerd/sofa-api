export interface QuestionFromModel extends QuestionToModel {
	_id: string
	createdAt: number
	updatedAt: number
}

export interface QuestionToModel {
	userId: string
	quizId: string
}