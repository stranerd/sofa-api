import type { EmailErrorToModel } from '../../data/models/emailErrors'
import type { EmailErrorEntity } from '../entities/emailErrors'

export interface IEmailErrorRepository {
	add: (data: EmailErrorToModel, id: string | undefined) => Promise<EmailErrorEntity>
	get: () => Promise<EmailErrorEntity[]>
	delete: (id: string) => Promise<boolean>
}
