import { appInstance } from '@utils/types'
import { QueryParams } from 'equipped'
import { IFileRepository } from '../../domain/irepositories/files'
import { DraftStatus, EmbeddedUser } from '../../domain/types'
import { FileMapper } from '../mappers/files'
import { FileToModel } from '../models/files'
import { File } from '../mongooseModels/files'

export class FileRepository implements IFileRepository {
	private static instance: FileRepository
	private mapper: FileMapper

	private constructor () {
		this.mapper = new FileMapper()
	}

	static getInstance () {
		if (!FileRepository.instance) FileRepository.instance = new FileRepository()
		return FileRepository.instance
	}

	async get (query: QueryParams) {
		const data = await appInstance.dbs.mongo.query(File, query)

		return {
			...data,
			results: data.results.map((r) => this.mapper.mapFrom(r)!)
		}
	}

	async add (data: FileToModel) {
		const file = await new File(data).save()
		return this.mapper.mapFrom(file)!
	}

	async find (id: string) {
		const file = await File.findById(id)
		return this.mapper.mapFrom(file)
	}

	async update (id: string, userId: string, data: Partial<FileToModel>) {
		const file = await File.findOneAndUpdate({
			_id: id, 'user.id': userId
		}, { $set: data }, { new: true })
		return this.mapper.mapFrom(file)
	}

	async updateUserBio (user: EmbeddedUser) {
		const files = await File.updateMany({ 'user.id': user.id }, { $set: { user } })
		return files.acknowledged
	}

	async delete (id: string, userId: string) {
		const file = await File.findOneAndDelete({
			_id: id, 'user.id': userId,
			$or: [
				{ courseId: null },
				{ courseId: { $ne: null }, status: DraftStatus.draft }
			]
		})
		return !!file
	}

	async publish (id: string, userId: string) {
		const file = await File.findOneAndUpdate({
			_id: id, 'user.id': userId, status: DraftStatus.draft, courseId: null
		}, { $set: { status: DraftStatus.published } }, { new: true })
		return this.mapper.mapFrom(file)
	}

	async updateRatings (id: string, ratings: number, add: boolean) {
		let res = false
		await File.collection.conn.transaction(async (session) => {
			const file = await File.findById(id, {}, { session })
			if (!file) return res
			file.ratings.total += (add ? 1 : -1) * ratings
			file.ratings.count += add ? 1 : -1
			file.ratings.avg = Number((file.ratings.total / file.ratings.count).toFixed(2))
			res = !!(await file.save({ session }))
			return res
		})
		return res
	}
}