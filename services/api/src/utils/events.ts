import { appInstance } from '@utils/types'
import { EventTypes, Events } from 'equipped'
import { sendMailAndCatchError, sendTextAndCatchError } from '@modules/notifications'
import { UploaderUseCases } from '@modules/storage'

const eventBus = appInstance.eventBus

export const subscribers = {
	[EventTypes.SENDMAIL]: eventBus.createSubscriber<Events['SENDMAIL']>(EventTypes.SENDMAIL, async (data) => {
		await sendMailAndCatchError(data)
	}),
	[EventTypes.SENDTEXT]: eventBus.createSubscriber<Events['SENDTEXT']>(EventTypes.SENDTEXT, async (data) => {
		await sendTextAndCatchError(data)
	}),
	[EventTypes.DELETEFILE]: eventBus.createSubscriber<Events['DELETEFILE']>(EventTypes.DELETEFILE, async (data) => {
		if (data?.path) await UploaderUseCases.delete(data.path)
	})
}

export const publishers = {
	[EventTypes.SENDMAIL]: eventBus.createPublisher<Events['SENDMAIL']>(EventTypes.SENDMAIL),
	[EventTypes.SENDTEXT]: eventBus.createPublisher<Events['SENDTEXT']>(EventTypes.SENDTEXT),
	[EventTypes.DELETEFILE]: eventBus.createPublisher<Events['DELETEFILE']>(EventTypes.DELETEFILE)
}
