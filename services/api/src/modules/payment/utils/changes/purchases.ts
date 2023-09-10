import { UsersUseCases } from '@modules/users'
import { appInstance as purchases } from '@utils/types'
import { DbChangeCallbacks } from 'equipped'
import { TransactionsUseCases } from '../../'
import { PurchaseFromModel } from '../../data/models/purchases'
import { PurchaseEntity } from '../../domain/entities/purchases'
import { Purchasables, TransactionStatus, TransactionType } from '../../domain/types'
import { NotificationType, sendNotification } from '@modules/notifications'
import { CourseMetaType, CoursesUseCases } from '@modules/study'

const serviceCharge = 0.2

export const PurchaseDbChangeCallbacks: DbChangeCallbacks<PurchaseFromModel, PurchaseEntity> = {
	created: async ({ after }) => {
		await purchases.listener.created([
			`payment/purchases/${after.userId}`,
			`payment/purchases/${after.data.userId}`,
			`payment/purchases/${after.id}/${after.userId}`,
			`payment/purchases/${after.id}/${after.data.userId}`
		], after)

		const user = await UsersUseCases.find(after.data.userId)
		await Promise.all([
			user ? TransactionsUseCases.create({
				title: `Purchase of one of your ${after.data.type}: ${after.data.id}`,
				userId: user.id, email: user.bio.email,
				amount: Math.ceil((1 - serviceCharge) * after.price.amount), currency: after.price.currency,
				status: TransactionStatus.fulfilled,
				data: {
					type: TransactionType.purchased,
					purchaseId: after.id,
					userId: after.userId,
					serviceCharge,
					purchasedType: after.data.type,
					purchasedId: after.data.id
				}
			}) : null,
			after.data.type === Purchasables.courses ? CoursesUseCases.updateMeta({ id: after.data.id, property: CourseMetaType.purchases, value: 1 }) : null,
			sendNotification([after.data.userId], {
				title: 'New Purchase',
				body: `Someone just purchased one of your ${after.data.type} #${after.data.id}`,
				sendEmail: true,
				data: { type: NotificationType.NewPurchase, id: after.id, purchasedType: after.data.type, purchasedId: after.data.id, userId: after.userId }
			}),
			sendNotification([after.userId], {
				title: 'Successful Purchase',
				body: `Your puchase of ${after.data.type} #${after.data.id} was successful`,
				sendEmail: true,
				data: { type: NotificationType.NewPurchased, id: after.id, purchasedType: after.data.type, purchasedId: after.data.id, userId: after.data.userId }
			})
		])
	},
	updated: async ({ after }) => {
		await purchases.listener.updated([
			`payment/purchases/${after.userId}`,
			`payment/purchases/${after.data.userId}`,
			`payment/purchases/${after.id}/${after.userId}`,
			`payment/purchases/${after.id}/${after.data.userId}`
		], after)
	},
	deleted: async ({ before }) => {
		await purchases.listener.deleted([
			`payment/purchases/${before.userId}`,
			`payment/purchases/${before.data.userId}`,
			`payment/purchases/${before.id}/${before.userId}`,
			`payment/purchases/${before.id}/${before.data.userId}`
		], before)

		await Promise.all([
			before.data.type === Purchasables.courses ? CoursesUseCases.updateMeta({ id: before.data.id, property: CourseMetaType.purchases, value: -1 }) : null,
		])
	}
}