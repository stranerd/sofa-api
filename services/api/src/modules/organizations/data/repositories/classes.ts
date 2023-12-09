import { appInstance } from '@utils/types'
import { QueryParams } from 'equipped'
import { IClassRepository } from '../../domain/irepositories/classes'
import { EmbeddedUser } from '../../domain/types'
import { ClassMapper } from '../mappers/classes'
import { ClassToModel } from '../models/classes'
import { Class } from '../mongooseModels/classes'

export class ClassRepository implements IClassRepository {
	private static instance: ClassRepository
	private mapper: ClassMapper

	private constructor () {
		this.mapper = new ClassMapper()
	}

	static getInstance () {
		if (!ClassRepository.instance) ClassRepository.instance = new ClassRepository()
		return ClassRepository.instance
	}

	async get (query: QueryParams) {
		const data = await appInstance.dbs.mongo.query(Class, query)

		return {
			...data,
			results: data.results.map((r) => this.mapper.mapFrom(r)!)
		}
	}

	async add (data: ClassToModel) {
		const classInst = await new Class(data).save()
		return this.mapper.mapFrom(classInst)!
	}

	async find (id: string) {
		const classIns = await Class.findById(id)
		return this.mapper.mapFrom(classIns)
	}

	async update (id: string, userId: string, data: Partial<ClassToModel>) {
		const classIns = await Class.findOneAndUpdate({
			_id: id,
			'user.id': userId
		}, { $set: data }, { new: true })
		return this.mapper.mapFrom(classIns)
	}

	async updateUserBio (user: EmbeddedUser) {
		const classes = await Class.updateMany({ 'user.id': user.id }, { $set: { user } })
		return classes.acknowledged
	}

	async delete (id: string, userId: string) {
		const classIns = await Class.findOneAndDelete({ _id: id, 'user.id': userId })
		return !!classIns
	}
}
