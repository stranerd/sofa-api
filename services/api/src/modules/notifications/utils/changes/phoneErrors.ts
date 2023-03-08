import { appInstance } from '@utils/types'
import { DbChangeCallbacks } from 'equipped'
import { PhoneErrorFromModel } from '../../data/models/phoneErrors'
import { PhoneErrorEntity } from '../../domain/entities/phoneErrors'

export const PhoneErrorDbChangeCallbacks: DbChangeCallbacks<PhoneErrorFromModel, PhoneErrorEntity> = {
	created: async ({ after }) => {
		await appInstance.logger.error(after.error)
	}
}