import { UploaderUseCases } from '@modules/storage'
import { canAccessCoursable, Coursable, DraftStatus, FilesUseCases, FileType } from '@modules/study'
import { UsersUseCases } from '@modules/users'
import {
	BadRequestError,
	NotAuthenticatedError,
	NotAuthorizedError,
	QueryParams,
	Request,
	Schema,
	validate,
	Validation,
	verifyAccessToken,
} from 'equipped'
import { verifyTags } from './tags'

const allowedDocumentTypes = ['application/pdf']

const schema = () => ({
	title: Schema.string().min(1),
	description: Schema.string().min(1),
	photo: Schema.file().image().nullable(),
	topic: Schema.string().min(1),
	tags: Schema.array(Schema.string().min(1)).set(),
})

export class FileController {
	static async find(req: Request) {
		const file = await FilesUseCases.find(req.params.id)
		return file
	}

	static async get(req: Request) {
		const query = req.query as QueryParams
		return await FilesUseCases.get(query)
	}

	static async create(req: Request) {
		const data = validate(
			{
				...schema(),
				media: Schema.or(
					[Schema.file().video(), Schema.file().image(), Schema.file().custom((val) => allowedDocumentTypes.includes(val?.type))],
					'unsupported file type',
				),
			},
			{
				...req.body,
				media: req.body.media?.at(0) ?? null,
				photo: req.body.photo?.at(0) ?? null,
			},
		)

		const tags = await verifyTags(data.topic, data.tags)

		const user = await UsersUseCases.find(req.authUser!.id)
		if (!user || user.isDeleted()) throw new BadRequestError('user not found')

		const media = await UploaderUseCases.upload('study/files/media', data.media)
		const photo = data.photo ? await UploaderUseCases.upload('study/files/covers', data.photo) : null

		const type = Validation.isImage()(data.media).valid
			? FileType.image
			: Validation.isVideo()(data.media).valid
				? FileType.video
				: FileType.document

		return await FilesUseCases.add({
			...data,
			...tags,
			user: user.getEmbedded(),
			photo,
			media,
			type,
			status: DraftStatus.draft,
		})
	}

	static async update(req: Request) {
		const uploadedPhoto = req.body.photo?.at(0) ?? null
		const changedPhoto = !!uploadedPhoto || req.body.photo === null

		const { photo: _, topic, tags, ...rest } = validate(schema(), { ...req.body, photo: uploadedPhoto })

		const utags = await verifyTags(topic, tags)

		const photo = uploadedPhoto ? await UploaderUseCases.upload('study/files/covers', uploadedPhoto) : undefined

		const updatedFile = await FilesUseCases.update({
			id: req.params.id,
			userId: req.authUser!.id,
			data: {
				...utags,
				...rest,
				...(changedPhoto ? { photo } : {}),
			},
		})
		if (updatedFile) return updatedFile
		throw new NotAuthorizedError()
	}

	static async delete(req: Request) {
		const isDeleted = await FilesUseCases.delete({ id: req.params.id, userId: req.authUser!.id })
		if (isDeleted) return isDeleted
		throw new NotAuthorizedError()
	}

	static async publish(req: Request) {
		const updatedFile = await FilesUseCases.publish({ id: req.params.id, userId: req.authUser!.id })
		if (updatedFile) return updatedFile
		throw new NotAuthorizedError()
	}

	static async media(req: Request) {
		const user = await verifyAccessToken(req.query.AccessToken ?? '')
		if (!user) throw new NotAuthenticatedError()
		const hasAccess = await canAccessCoursable(Coursable.file, req.params.id, user, req.query.access)
		if (!hasAccess) throw new NotAuthorizedError('cannot access this file')
		return hasAccess.media
	}
}
