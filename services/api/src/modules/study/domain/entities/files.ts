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
	public readonly tagId: CoursableData['tagId']
	public readonly status: CoursableData['status']
	public readonly createdAt: number
	public readonly updatedAt: number

	constructor ({ id, title, description, media, photo, type, courseId, user, tagId, status, createdAt, updatedAt }: FileConstructorArgs) {
		super()
		this.id = id
		this.title = title
		this.description = description
		this.photo = photo
		this.type = type
		this.media = media
		this.courseId = courseId
		this.user = generateDefaultUser(user)
		this.tagId = tagId
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