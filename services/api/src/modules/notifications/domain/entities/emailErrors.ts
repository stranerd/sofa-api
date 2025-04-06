import type { EmailsList, Enum } from 'equipped'
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
	from: Enum<typeof EmailsList>
	data: {
		attachments?: Record<string, boolean>
	}
	tries: number
	createdAt: number
	updatedAt: number
}
