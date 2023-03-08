import { EmailErrorFromModel } from '../../data/models/emailErrors'
import { EmailErrorEntity } from '../../domain/entities/emailErrors'
import { DbChangeCallbacks } from 'equipped'
import { appInstance } from '@utils/types'

export const EmailErrorDbChangeCallbacks: DbChangeCallbacks<EmailErrorFromModel, EmailErrorEntity> = {
	created: async ({ after }) => {
		await appInstance.logger.error(after.error)
	}
}