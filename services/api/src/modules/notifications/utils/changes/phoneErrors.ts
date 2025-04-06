import type { DbChangeCallbacks } from 'equipped'

import { appInstance } from '@utils/types'

import type { PhoneErrorFromModel } from '../../data/models/phoneErrors'
import type { PhoneErrorEntity } from '../../domain/entities/phoneErrors'

export const PhoneErrorDbChangeCallbacks: DbChangeCallbacks<PhoneErrorFromModel, PhoneErrorEntity> = {
	created: async ({ after }) => {
		await appInstance.logger.error(after.error)
	},
}
