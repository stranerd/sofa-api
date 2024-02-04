import { NotificationType, sendNotification } from '@modules/notifications'
import { canAccessOrgClasses } from '@modules/organizations'
import { UserEntity, UsersUseCases } from '@modules/users'
import { appInstance } from '@utils/types'
import { BadRequestError, DelayedJobs } from 'equipped'
import { MethodsUseCases, TransactionsUseCases, WalletsUseCases } from '../../'

import { MethodEntity } from '../../domain/entities/methods'
import { WalletEntity } from '../../domain/entities/wallets'
import { Currencies, Subscription, TransactionStatus, TransactionType } from '../../domain/types'
import { FlutterwavePayment } from '../flutterwave'

type Sub = {
	title: string
	amount: number
	currency: Currencies
	interval: 'monthly' | 'weekly'
}

const verifyData = async (data: Subscription['data'], user: UserEntity): Promise<Sub | null> => {
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

const activateSub = async (userId: string, wallet: WalletEntity, data: Subscription['data'], sub: Sub) => {
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

const deactivateSub = async (userId: string, wallet: WalletEntity, data: Subscription['data'], sub: Sub | null) => {
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

const chargeForSubscription = async (user: UserEntity, sub: Sub, data: Subscription['data'], method: MethodEntity) => {
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

export const createSubscriptionTo = async (userId: string, subscriptionData: Subscription['data']) => {
	const wallet = await WalletsUseCases.get(userId)
	const sub = wallet.getSubscription(subscriptionData)
	if (sub?.active) return wallet

	const user = await UsersUseCases.find(userId)
	if (!user || user.isDeleted()) throw new BadRequestError('profile not found')

	const data = await verifyData(subscriptionData, user)
	if (!data) throw new BadRequestError('cannot initiate subscription')

	const { results: methods } = await MethodsUseCases.get({
		where: [
			{ field: 'userId', value: userId },
			{ field: 'primary', value: true },
		],
	})
	const method = methods.at(0)
	if (!method) throw new BadRequestError('no method found')

	const successful = await chargeForSubscription(user, data, subscriptionData, method)
	if (!successful) throw new BadRequestError('charge failed')
	return activateSub(userId, wallet, subscriptionData, data)
}

export const renewSubscriptionTo = async (userId: string, subscriptionData: Subscription['data']) => {
	const wallet = await WalletsUseCases.get(userId)
	const sub = wallet.getSubscription(subscriptionData)
	if (!sub?.next) return await deactivateSub(userId, wallet, subscriptionData, null)

	const user = await UsersUseCases.find(userId)
	if (!user || user.isDeleted()) return await deactivateSub(userId, wallet, subscriptionData, null)

	const data = await verifyData(subscriptionData, user)
	if (!data) return await deactivateSub(userId, wallet, subscriptionData, null)

	const { results: methods } = await MethodsUseCases.get({
		where: [
			{ field: 'userId', value: userId },
			{ field: 'primary', value: true },
		],
	})
	const method = methods.at(0)
	if (!method) return await deactivateSub(userId, wallet, subscriptionData, data)

	const successful = await chargeForSubscription(user, data, subscriptionData, method)
	return successful ? activateSub(userId, wallet, subscriptionData, data) : await deactivateSub(userId, wallet, subscriptionData, data)
}

export const cancelSubscriptionTo = async (userId: string, subscriptionData: Subscription['data']) => {
	const wallet = await WalletsUseCases.get(userId)
	return deactivateSub(userId, wallet, subscriptionData, null)
}
