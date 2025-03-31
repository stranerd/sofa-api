import { PhoneErrorToModel } from '../../data/models/phoneErrors'
import { PhoneErrorEntity } from '../entities/phoneErrors'

export interface IPhoneErrorRepository {
	add: (data: PhoneErrorToModel, id: string | undefined) => Promise<PhoneErrorEntity>
	get: () => Promise<PhoneErrorEntity[]>
	delete: (id: string) => Promise<boolean>
}
