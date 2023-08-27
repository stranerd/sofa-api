import { generateDefaultUser } from '@modules/users'
import { BaseEntity } from 'equipped'
import { CoursableData, FileType, Media } from '../types'

export class FileEntity extends BaseEntity implements CoursableData {
	public readonly id: string
	public readonly type: FileType
	public readonly media: Media
	public readonly title: CoursableData['title']
	public readonly description: CoursableData['description']
	public readonly photo: CoursableData['photo']
	public readonly courseId: CoursableData['courseId']
	public readonly user: CoursableData['user']
	public readonly topicId: CoursableData['topicId']
	public readonly tagIds: CoursableData['tagIds']
	public readonly ratings: CoursableData['ratings']
	public readonly status: CoursableData['status']
	public readonly createdAt: number
	public readonly updatedAt: number
	ignoreInJSON = ['media']

	constructor ({ id, title, description, media, photo, type, courseId, user, topicId, tagIds, ratings, status, createdAt, updatedAt }: FileConstructorArgs) {
		super()
		this.id = id
		this.title = title
		this.description = description
		this.photo = photo
		this.type = type
		this.media = media
		this.courseId = courseId
		this.user = generateDefaultUser(user)
		this.topicId = topicId
		this.tagIds = tagIds
		this.ratings = ratings
		this.status = status
		this.createdAt = createdAt
		this.updatedAt = updatedAt
	}
}

type FileConstructorArgs = CoursableData & {
	id: string
	type: FileType
	media: Media
	createdAt: number
	updatedAt: number
}