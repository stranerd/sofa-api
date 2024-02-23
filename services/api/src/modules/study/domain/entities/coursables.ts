import { generateDefaultUser } from '@modules/users'
import { BaseEntity } from 'equipped'
import { CoursableData, Publishable } from '../types'

export class PublishableEntity<T extends PublishableConstructorArgs> extends BaseEntity<T> implements Publishable {
	constructor(data: T) {
		data.user = generateDefaultUser(data.user)
		super(data)
	}
}

type PublishableConstructorArgs = Publishable & {
	id: string
	createdAt: number
	updatedAt: number
}

export class CoursableEntity<T extends PublishableConstructorArgs & { courseId: string | null }>
	extends PublishableEntity<T>
	implements CoursableData
{
	public readonly courseId: string | null

	constructor(data: T & { courseId: string | null }) {
		super(data)
		this.courseId = data.courseId
	}
}
