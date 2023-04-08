import { TagsUseCases } from '@modules/interactions'
import { UploaderUseCases } from '@modules/storage'
import { canAccessCoursable, Coursable, DraftStatus, FilesUseCases, FileType } from '@modules/study'
import { UsersUseCases } from '@modules/users'
import { BadRequestError, MediaOutput, NotAuthorizedError, QueryParams, Request, Schema, validate, Validation } from 'equipped'

const allowedDocumentTypes = ['application/pdf', 'text/plain']

export class FileController {
	private static schema = () => ({
		title: Schema.string().min(1),
		description: Schema.string().min(1),
		photo: Schema.file().image().nullable()
	})

	static async find (req: Request) {
		return await FilesUseCases.find(req.params.id)
	}

	static async get (req: Request) {
		const query = req.query as QueryParams
		return await FilesUseCases.get(query)
	}

	static async create (req: Request) {
		const data = validate({
			...this.schema(),
			tagId: Schema.string().min(1),
			media: Schema.or([
				Schema.file().video(),
				Schema.file().image(),
				Schema.file().addRule((val) => {
					const value = val as MediaOutput
					if (value.type && allowedDocumentTypes.includes(value.type)) return Validation.isValid(value)
					return Validation.isInvalid(['invalid file type'], value)
				})
			])
		}, {
			...req.body,
			media: req.files.media?.at(0) ?? null,
			photo: req.files.photo?.at(0) ?? null
		})

		const tag = await TagsUseCases.find(data.tagId)
		if (!tag || !tag.isTopic()) throw new BadRequestError('invalid tag')

		const user = await UsersUseCases.find(req.authUser!.id)
		if (!user || user.isDeleted()) throw new BadRequestError('user not found')

		const media = await UploaderUseCases.upload('study/files/media', data.media)
		const photo = data.photo ? await UploaderUseCases.upload('study/files/covers', data.photo) : null

		const type = Validation.isImage()(data.media).valid ? FileType.image :
			Validation.isVideo()(data.media).valid ? FileType.video : FileType.document

		return await FilesUseCases.add({
			...data, user: user.getEmbedded(),
			photo, media, type, status: DraftStatus.draft,
			courseId: null
		})
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
		const hasAccess = await canAccessCoursable(Coursable.file, req.params.id, req.authUser!.id)
		if (!hasAccess) throw new NotAuthorizedError('cannot access this file')
		return hasAccess.media
	}
}