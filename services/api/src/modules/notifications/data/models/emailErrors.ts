import type { EmailsList, Enum } from 'equipped'

export interface EmailErrorFromModel extends EmailErrorToModel {
	_id: string
	tries: number
	createdAt: number
	updatedAt: number
}

export interface EmailErrorToModel {
	error: string
	subject: string
	to: string
	content: string
	from: Enum<typeof EmailsList>
	data: {
		attachments?: Record<string, boolean>
	}
}
