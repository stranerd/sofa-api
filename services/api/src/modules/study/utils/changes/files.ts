import { TagMeta, TagsUseCases } from '@modules/interactions'
import { ScoreRewards, UserMeta, UsersUseCases } from '@modules/users'
import { publishers } from '@utils/events'
import { appInstance } from '@utils/types'
import { DbChangeCallbacks } from 'equipped'
import { CoursesUseCases, FoldersUseCases } from '../..'
import { FileFromModel } from '../../data/models/files'
import { FileEntity } from '../../domain/entities/files'
import { Coursable, DraftStatus, FileType, FolderSaved } from '../../domain/types'

const getProp = (type: FileType) =>
	({
		[FileType.document]: [UserMeta.documents, TagMeta.documents, UserMeta.publishedDocuments] as const,
		[FileType.image]: [UserMeta.images, TagMeta.images, UserMeta.publishedImages] as const,
		[FileType.video]: [UserMeta.videos, TagMeta.videos, UserMeta.publishedVideos] as const,
	})[type]

export const FileDbChangeCallbacks: DbChangeCallbacks<FileFromModel, FileEntity> = {
	created: async ({ after }) => {
		await appInstance.listener.created(['study/files', `study/files/${after.id}`], after)

		await UsersUseCases.updateNerdScore({
			userId: after.user.id,
			amount: ScoreRewards.newFile,
		})
		const [userType, tagType] = getProp(after.type)
		await UsersUseCases.incrementMeta({ id: after.user.id, value: 1, property: userType })
		await TagsUseCases.updateMeta({ ids: after.tagIds.concat(after.topicId), property: tagType, value: 1 })
	},
	updated: async ({ after, before, changes }) => {
		await appInstance.listener.updated(['study/files', `study/files/${after.id}`], after)
		if (changes.photo && before.photo) await publishers.DELETEFILE.publish(before.photo)
		if (changes.media) await publishers.DELETEFILE.publish(before.media)

		const [_, tagType, publishedUserType] = getProp(after.type)
		if (changes.topicId || changes.tagIds) {
			const previousTags = before.tagIds.concat(before.topicId)
			const currentTags = after.tagIds.concat(after.topicId)
			const removed = previousTags.filter((t) => !currentTags.includes(t))
			const added = currentTags.filter((t) => !previousTags.includes(t))
			await Promise.all([
				TagsUseCases.updateMeta({ ids: removed, property: tagType, value: -1 }),
				TagsUseCases.updateMeta({ ids: added, property: tagType, value: 1 }),
			])
		}

		if (changes.status && (before.status === DraftStatus.published || after.status === DraftStatus.published))
			await UsersUseCases.incrementMeta({
				id: after.user.id,
				value: after.status === DraftStatus.published ? 1 : -1,
				property: publishedUserType,
			})
	},
	deleted: async ({ before }) => {
		await appInstance.listener.deleted(['study/files', `study/files/${before.id}`], before)

		if (before.courseId)
			await CoursesUseCases.move({
				id: before.courseId,
				type: Coursable.file,
				coursableId: before.id,
				userId: before.user.id,
				add: false,
			}).catch()
		await FoldersUseCases.removeProp({ prop: FolderSaved.files, value: before.id })
		await UsersUseCases.updateNerdScore({
			userId: before.user.id,
			amount: -ScoreRewards.newFile,
		})
		const [userType, tagType, publishedUserType] = getProp(before.type)
		await UsersUseCases.incrementMeta({ id: before.user.id, value: -1, property: userType })
		if (before.status === DraftStatus.published)
			await UsersUseCases.incrementMeta({ id: before.user.id, value: -1, property: publishedUserType })
		await TagsUseCases.updateMeta({ ids: before.tagIds.concat(before.topicId), property: tagType, value: -1 })
		await publishers.DELETEFILE.publish(before.media)
		if (before.photo) await publishers.DELETEFILE.publish(before.photo)
	},
}
