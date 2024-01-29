import { appInstance } from '@utils/types'
import { QueryParams } from 'equipped'
import { FacultyEntity } from '../../domain/entities/faculties'
import { IFacultyRepository } from '../../domain/irepositories/faculties'
import { FacultyMapper } from '../mappers/faculties'
import { FacultyToModel } from '../models/faculties'
import { Faculty } from '../mongooseModels/faculties'

export class FacultyRepository implements IFacultyRepository {
	private static instance: FacultyRepository
	private mapper: FacultyMapper

	private constructor() {
		this.mapper = new FacultyMapper()
	}

	static getInstance() {
		if (!FacultyRepository.instance) FacultyRepository.instance = new FacultyRepository()
		return FacultyRepository.instance
	}

	async get(query: QueryParams) {
		const data = await appInstance.dbs.mongo.query(Faculty, query)

		return {
			...data,
			results: data.results.map((r) => this.mapper.mapFrom(r)!),
		}
	}

	async delete(id: string): Promise<boolean> {
		const deleteData = await Faculty.findByIdAndDelete(id)
		return !!deleteData
	}

	async deleteInstitutionFaculties(institutionId: string): Promise<boolean> {
		const deleteData = await Faculty.deleteMany({ institutionId })
		return deleteData.acknowledged
	}

	async add(data: FacultyToModel) {
		const faculty = await new Faculty(data).save()
		return this.mapper.mapFrom(faculty)!
	}

	async update(id: string, data: Partial<FacultyToModel>) {
		const faculty = await Faculty.findByIdAndUpdate(id, { $set: data }, { new: true })
		return this.mapper.mapFrom(faculty)
	}

	async find(id: string): Promise<FacultyEntity | null> {
		const faculty = await Faculty.findById(id)
		return this.mapper.mapFrom(faculty)
	}
}
