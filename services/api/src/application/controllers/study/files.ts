import { UploaderUseCases } from '@modules/storage'
import { canAccessCoursable, Coursable, CoursesUseCases, DraftStatus, FilesUseCases, FileType } from '@modules/study'
import { UsersUseCases } from '@modules/users'
import { BadRequestError, NotAuthenticatedError, NotAuthorizedError, QueryKeys, QueryParams, Request, Schema, validate, Validation, verifyAccessToken } from 'equipped'
import { verifyTags } from './tags'

const allowedDocumentTypes = ['application/pdf']

export class FileController {
	private static schema = () => ({
		title: Schema.string().min(1),
		description: Schema.string().min(1),
		photo: Schema.file().image().nullable(),
		topicId: Schema.string().min(1),
		tagIds: Schema.array(Schema.string().min(1).lower().trim()).set(),
	})

	static async find (req: Request) {
		const file = await FilesUseCases.find(req.params.id)
		if (!file) return null
		if (file.user.id !== req.authUser?.id && file.status !== DraftStatus.published) return null
		return file
	}

	static async get (req: Request) {
		const query = req.query as QueryParams
		query.auth = [
			{ condition: QueryKeys.or, value: [{ field: 'status', value: DraftStatus.published }, ...(req.authUser ? [{ field: 'user.id', value: req.authUser.id }] : []) ] }
		]
		return await FilesUseCases.get(query)
	}

	static async create (req: Request) {
		const data = validate({
			...this.schema(),
			courseId: Schema.string().min(1).nullable().default(null),
			media: Schema.or([
				Schema.file().video(),
				Schema.file().image(),
				Schema.file().custom((val) => allowedDocumentTypes.includes(val?.type))
			], 'unsupported file type')
		}, {
			...req.body,
			media: req.files.media?.at(0) ?? null,
			photo: req.files.photo?.at(0) ?? null
		})

		const tags = await verifyTags(data.topicId, data.tagIds)

		const user = await UsersUseCases.find(req.authUser!.id)
		if (!user || user.isDeleted()) throw new BadRequestError('user not found')

		const media = await UploaderUseCases.upload('study/files/media', data.media)
		const photo = data.photo ? await UploaderUseCases.upload('study/files/covers', data.photo) : null

		const type = Validation.isImage()(data.media).valid ? FileType.image :
			Validation.isVideo()(data.media).valid ? FileType.video : FileType.document

		const file = await FilesUseCases.add({
			...data, ...tags, user: user.getEmbedded(),
			photo, media, type, status: DraftStatus.draft,
			courseId: null
		})

		if (data.courseId) await CoursesUseCases.move({ id: data.courseId, userId: file.user.id, coursableId: file.id, type: Coursable.file, add: true })
			.catch()

		return file
	}

	static async update (req: Request) {
		const uploadedPhoto = req.files.photo?.at(0) ?? null
		const changedPhoto = !!uploadedPhoto || req.body.photo === null

		const { title, description, topicId, tagIds } = validate(this.schema(), { ...req.body, photo: uploadedPhoto })

		const utags = await verifyTags(topicId, tagIds)

		const photo = uploadedPhoto ? await UploaderUseCases.upload('study/files/covers', uploadedPhoto) : undefined

		const updatedFile = await FilesUseCases.update({
			id: req.params.id, userId: req.authUser!.id,
			data: {
				...utags, title, description,
				...(changedPhoto ? { photo } : {})
			}
		})
		if (updatedFile) return updatedFile
		throw new NotAuthorizedError()
	}

	static async delete (req: Request) {
		const isDeleted = await FilesUseCases.delete({ id: req.params.id, userId: req.authUser!.id })
		if (isDeleted) return isDeleted
		throw new NotAuthorizedError()
	}

	static async publish (req: Request) {
		const updatedFile = await FilesUseCases.publish({ id: req.params.id, userId: req.authUser!.id })
		if (updatedFile) return updatedFile
		throw new NotAuthorizedError()
	}

	static async media (req: Request) {
		const user = await verifyAccessToken(req.query.AccessToken ?? '')
		if (!user) throw new NotAuthenticatedError()
		const hasAccess = await canAccessCoursable(Coursable.file, req.params.id, user)
		if (!hasAccess) throw new NotAuthorizedError('cannot access this file')
		return hasAccess.media
	}
}