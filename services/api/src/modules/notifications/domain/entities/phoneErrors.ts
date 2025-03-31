import { BaseEntity } from 'equipped'

export class PhoneErrorEntity extends BaseEntity<ErrorConstructor> {
	constructor(data: ErrorConstructor) {
		super(data)
	}
}

type ErrorConstructor = {
	id: string
	error: string
	to: string
	content: string
	from: string
	tries: number
	createdAt: number
	updatedAt: number
}
