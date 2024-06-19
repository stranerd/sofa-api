import { generateDefaultUser } from '@modules/users'
import { BaseEntity } from 'equipped'
import { CoursableData, Publishable } from '../types'

export class PublishableEntity<T extends PublishableConstructorArgs, I extends string = never>
	extends BaseEntity<T, I>
	implements Publishable
{
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

export class CoursableEntity<T extends PublishableConstructorArgs & { courseIds: string[] }, I extends string = never>
	extends PublishableEntity<T, I>
	implements CoursableData
{
	constructor(data: T & { courseIds: string[] }) {
		super(data)
	}
}
