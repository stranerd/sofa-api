
export interface AnswerFromModel extends AnswerToModel {
	_id: string
	data: Record<string, any>
	createdAt: number
	updatedAt: number
}

export interface AnswerToModel {
	gameId: string
	userId: string
}