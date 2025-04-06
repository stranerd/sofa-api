import type { DbChangeCallbacks } from 'equipped'

import { appInstance } from '@utils/types'

import type { EmailErrorFromModel } from '../../data/models/emailErrors'
import type { EmailErrorEntity } from '../../domain/entities/emailErrors'

export const EmailErrorDbChangeCallbacks: DbChangeCallbacks<EmailErrorFromModel, EmailErrorEntity> = {
	created: async ({ after }) => {
		await appInstance.logger.error(after.error)
	},
}
