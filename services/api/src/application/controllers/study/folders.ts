import { FolderSaved, FoldersUseCases } from '@modules/study'
import { UsersUseCases } from '@modules/users'
import { BadRequestError, NotAuthorizedError, QueryParams, Request, Schema, validateReq } from 'equipped'

export class FolderController {
	static async find (req: Request) {
		return await FoldersUseCases.find(req.params.id)
	}

	static async get (req: Request) {
		const query = req.query as QueryParams
		return await FoldersUseCases.get(query)
	}

	static async create (req: Request) {
		const data = validateReq({
			name: Schema.string().min(1),
		}, req.body)

		const authUserId = req.authUser!.id
		const user = await UsersUseCases.find(authUserId)
		if (!user || user.isDeleted()) throw new BadRequestError('user not found')

		return await FoldersUseCases.add({ ...data, user: user.getEmbedded() })
	}

	static async update (req: Request) {
		const data = validateReq({
			name: Schema.string().min(1),
		}, req.body)

		const updatedFolder = await FoldersUseCases.update({ id: req.params.id, userId: req.authUser!.id, data })
		if (updatedFolder) return updatedFolder
		throw new NotAuthorizedError()
	}

	static async saveProp (req: Request) {
		const data = validateReq({
			type: Schema.any<FolderSaved>().in(Object.values(FolderSaved)),
			propIds: Schema.array(Schema.string().min(1)),
			add: Schema.boolean()
		}, req.body)

		const updated = await FoldersUseCases.updateProp({
			id: req.params.id,
			userId: req.authUser!.id,
			values: data.propIds,
			add: data.add,
			prop: data.type
		})

		if (updated) return updated
		throw new NotAuthorizedError()
	}

	static async delete (req: Request) {
		const isDeleted = await FoldersUseCases.delete({ id: req.params.id, userId: req.authUser!.id })

		if (isDeleted) return isDeleted
		throw new NotAuthorizedError()
	}
}