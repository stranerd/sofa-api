import { BaseEntity } from 'equipped'

export class EmailErrorEntity extends BaseEntity<ErrorConstructor> {
	constructor(data: ErrorConstructor) {
		super(data)
	}
}

type ErrorConstructor = {
	id: string
	error: string
	subject: string
	to: string
	content: string
	from: string
	data: {
		attachments?: Record<string, boolean>
	}
	createdAt: number
	updatedAt: number
}
