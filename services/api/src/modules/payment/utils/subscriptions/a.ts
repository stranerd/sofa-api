import { NotificationType, sendNotification } from '@modules/notifications'
import { canAccessOrgClasses } from '@modules/organizations'
import { UserEntity, UsersUseCases } from '@modules/users'
import { appInstance } from '@utils/types'
import { BadRequestError, DelayedJobs } from 'equipped'
import { FlutterwavePayment, MethodsUseCases, TransactionsUseCases, WalletsUseCases } from '../..'
import { MethodEntity } from '../../domain/entities/methods'
import { WalletEntity } from '../../domain/entities/wallets'
import { Currencies, Subscription, TransactionStatus, TransactionType } from '../../domain/types'

type Sub = {
	title: string
	amount: number
	currency: Currencies
	interval: 'monthly' | 'weekly'
}

const activateGeneric = async (userId: string, wallet: WalletEntity, data: Subscription['data'], sub: Sub) => {
	const now = Date.now()
	const renewedAt = wallet.getNextCharge(sub.interval, now)
	const jobId = await appInstance.job.addDelayedJob(
		{
			type: DelayedJobs.RenewGenericSubscription,
			data: { userId, data },
		},
		renewedAt - now,
	)
	await sendNotification([userId], {
		title: `Subscription to ${sub.title} successful`,
		body: `Your subscription to ${sub.title} has been activated successfully`,
		data: { type: NotificationType.GenericSubscriptionSuccessful, data },
		sendEmail: true,
	})
	return await WalletsUseCases.updateSubscriptions({
		id: wallet.id,
		subscription: {
			active: true,
			current: { activatedAt: now, expiredAt: renewedAt, jobId },
			next: { renewedAt },
			data,
		},
	})
}

const deactivateGeneric = async (userId: string, wallet: WalletEntity, data: Subscription['data'], sub: Sub | null) => {
	if (sub)
		await sendNotification([userId], {
			title: `Subscription to ${sub.title} failed`,
			body: `Your subscription to ${sub.title} failed to be activated`,
			data: { type: NotificationType.GenericSubscriptionFailed, data },
			sendEmail: true,
		})
	const oldSub = wallet.getSubscription(data)
	if (!oldSub) return wallet
	return await WalletsUseCases.updateSubscriptions({
		id: wallet.id,
		subscription: { active: false, current: oldSub.current, next: null, data },
	})
}

const chargeGeneric = async (user: UserEntity, sub: Sub, data: Subscription['data'], method: MethodEntity) => {
	if (sub.amount <= 0) return true
	try {
		const transaction = await TransactionsUseCases.create({
			userId: user.id,
			email: user.bio.email,
			amount: 0 - sub.amount,
			currency: sub.currency,
			status: TransactionStatus.initialized,
			title: `Subscription charge for ${sub.title}`,
			data: { type: TransactionType.genericSubscription, data },
		})
		const successful = await FlutterwavePayment.chargeCard({
			email: transaction.email,
			amount: transaction.amount,
			currency: transaction.currency,
			token: method.token,
			id: transaction.id,
		})
		await TransactionsUseCases.update({
			id: transaction.id,
			data: { status: successful ? TransactionStatus.settled : TransactionStatus.failed },
		})
		return successful
	} catch {
		return false
	}
}

export class Subscriptions {
	private static async run(
		userId: string,
		subscriptionData: Subscription['data'],
		wallet: WalletEntity,
		charge: (user: UserEntity, sub: Sub, data: Subscription['data'], method: MethodEntity) => Promise<boolean>,
		onSuccess: (userId: string, wallet: WalletEntity, data: Subscription['data'], sub: Sub) => Promise<WalletEntity>,
		onFail: (userId: string, wallet: WalletEntity, data: Subscription['data'], sub: Sub | null, error: string) => Promise<WalletEntity>,
	) {
		const user = await UsersUseCases.find(userId)
		if (!user || user.isDeleted()) return await onFail(userId, wallet, subscriptionData, null, 'profile not found')

		const data = await Subscriptions.verifyData(subscriptionData, user)
		if (!data) return await onFail(userId, wallet, subscriptionData, null, 'cannot initiate subscription')

		const { results: methods } = await MethodsUseCases.get({
			where: [
				{ field: 'userId', value: userId },
				{ field: 'primary', value: true },
			],
		})
		const method = methods.at(0)
		if (!method) return await onFail(userId, wallet, subscriptionData, data, 'no method found')

		const successful = await charge(user, data, subscriptionData, method)
		return successful
			? await onSuccess(userId, wallet, subscriptionData, data)
			: await onFail(userId, wallet, subscriptionData, data, 'charge failed')
	}

	private static async verifyData(data: Subscription['data'], user: UserEntity): Promise<Sub | null> {
		if (data.type === 'classes') {
			const access = await canAccessOrgClasses(
				{
					id: user.id,
					email: user.bio.email,
					roles: user.roles,
					isEmailVerified: true,
				},
				data.organizationId,
				data.classId,
			)
			if (!access) return null
			return {
				amount: access.role ? 0 : access.class.price.amount,
				currency: access.class.price.currency,
				title: access.class.title,
				interval: 'monthly',
			}
		}
		return null
	}

	static async createGeneric(userId: string, data: Subscription['data']) {
		const wallet = await WalletsUseCases.get(userId)
		const sub = wallet.getSubscription(data)
		if (sub?.active) return wallet
		return await Subscriptions.run(userId, data, wallet, chargeGeneric, activateGeneric, (_, __, ___, ____, error) => {
			throw new BadRequestError(error)
		})
	}

	static async renewGeneric(userId: string, data: Subscription['data']) {
		const wallet = await WalletsUseCases.get(userId)
		const sub = wallet.getSubscription(data)
		if (!sub?.next) return await deactivateGeneric(userId, wallet, data, null)
		return await Subscriptions.run(userId, data, wallet, chargeGeneric, activateGeneric, deactivateGeneric)
	}

	static async cancelGeneric(userId: string, subscriptionData: Subscription['data']) {
		const wallet = await WalletsUseCases.get(userId)
		return deactivateGeneric(userId, wallet, subscriptionData, null)
	}
}
