import { appInstance } from '@utils/types'
import { QueryParams } from 'equipped'
import { IFolderRepository } from '../../domain/irepositories/folders'
import { EmbeddedUser, FolderSaved } from '../../domain/types'
import { FolderMapper } from '../mappers/folders'
import { FolderToModel } from '../models/folders'
import { Folder } from '../mongooseModels/folders'

export class FolderRepository implements IFolderRepository {
	private static instance: FolderRepository
	private mapper: FolderMapper

	private constructor () {
		this.mapper = new FolderMapper()
	}

	static getInstance () {
		if (!FolderRepository.instance) FolderRepository.instance = new FolderRepository()
		return FolderRepository.instance
	}

	async get (query: QueryParams) {
		const data = await appInstance.dbs.mongo.query(Folder, query)

		return {
			...data,
			results: data.results.map((r) => this.mapper.mapFrom(r)!)
		}
	}

	async add (data: FolderToModel) {
		const folder = await new Folder(data).save()
		return this.mapper.mapFrom(folder)!
	}

	async find (id: string) {
		const folder = await Folder.findById(id)
		return this.mapper.mapFrom(folder)
	}

	async update (id: string, userId: string, data: Partial<FolderToModel>) {
		const folder = await Folder.findOneAndUpdate({ _id: id, 'user.id': userId }, { $set: data }, { new: true })
		return this.mapper.mapFrom(folder)
	}

	async updateUserBio (user: EmbeddedUser) {
		const folders = await Folder.updateMany({ 'user.id': user.id }, { $set: { user } })
		return folders.acknowledged
	}

	async delete (id: string, userId: string) {
		const folder = await Folder.findOneAndDelete({ _id: id, 'user.id': userId })
		return !!folder
	}

	async updateProp (id: string, userId: string, prop: FolderSaved, add: boolean, values: string[]) {
		const folder = await Folder.findOneAndUpdate({ _id: id, 'user.id': userId }, {
			[add ? '$addToSet' : '$pull']: {
				[`saved.${prop}`]: {
					[add ? '$each' : '$in']: values
				}
			}
		}, { new: true })
		return this.mapper.mapFrom(folder)
	}

	async removeProp (prop: FolderSaved, value: string) {
		const folders = await Folder.updateMany({ [`saved.${prop}`]: value }, {
			$pull: { [`saved.${prop}`]: value }
		})
		return folders.acknowledged
	}
}