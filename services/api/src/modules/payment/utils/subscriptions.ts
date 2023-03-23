import { UserEntity, UsersUseCases } from '@modules/users'
import { appInstance } from '@utils/types'
import { BadRequestError, DelayedJobs } from 'equipped'
import { MethodsUseCases, PlansUseCases, TransactionsUseCases, WalletsUseCases } from '../'
import { MethodEntity } from '../domain/entities/methods'
import { PlanEntity } from '../domain/entities/plans'
import { TransactionStatus, TransactionType } from '../domain/types'
import { FlutterwavePayment } from './flutterwave'

const activateSub = async (userId: string, walletId: string, subscription: PlanEntity) => {
	const now = Date.now()
	const renewedAt = subscription.getNextCharge(now)
	const jobId = await appInstance.job.addDelayedJob({
		type: DelayedJobs.RenewSubscription, data: { userId }
	}, renewedAt - now)
	return await WalletsUseCases.updateSubscription({
		id: walletId,
		data: {
			active: true,
			current: { id: subscription.id, activatedAt: now, expiredAt: renewedAt, jobId },
			next: { id: subscription.id, renewedAt },
			data: subscription.data
		}
	})
}

const chargeForSubscription = async (user: UserEntity, subscription: PlanEntity, method: MethodEntity) => {
	const transaction = await TransactionsUseCases.create({
		userId: user.id, email: user.bio.email, amount: 0 - subscription.amount, currency: subscription.currency,
		status: TransactionStatus.initialized, title: `Subscription charge for ${subscription.title}`,
		data: { type: TransactionType.subscription, subscriptionId: subscription.id }
	})
	const successful = await FlutterwavePayment.chargeCard({
		email: transaction.email, amount: Math.abs(transaction.amount), currency: transaction.currency,
		token: method.token, id: transaction.id
	})
	await TransactionsUseCases.update({
		id: transaction.id,
		data: { status: successful ? TransactionStatus.settled : TransactionStatus.failed }
	})
	return successful
}

const deactivateSub = async (walletId: string) => await WalletsUseCases.updateSubscription({
	id: walletId, data: { active: false, next: null }
})

export const subscribeToPlan = async (userId: string, subscriptionId: string) => {
	const wallet = await WalletsUseCases.get(userId)
	if (wallet.subscription.active) return wallet
	const user = await UsersUseCases.find(userId)
	if (!user) throw new BadRequestError('profile not found')
	const subscription = await PlansUseCases.find(subscriptionId)
	if (!subscription) throw new BadRequestError('subscription not found')
	if (!subscription.active) throw new BadRequestError('you cant subscribe to this plan currently')
	const { results: methods } = await MethodsUseCases.get({
		where: [{ field: 'userId', value: userId }, { field: 'primary', value: true }]
	})
	const method = methods.at(0)
	if (!method) throw new BadRequestError('no method found')
	const successful = await chargeForSubscription(user, subscription, method)
	if (!successful) throw new BadRequestError('charge failed')
	return activateSub(userId, wallet.id, subscription)
}

export const renewSubscription = async (userId: string) => {
	const wallet = await WalletsUseCases.get(userId)
	if (!wallet.subscription.next) return await deactivateSub(wallet.id)
	const user = await UsersUseCases.find(userId)
	if (!user) return await deactivateSub(wallet.id)
	const subscription = await PlansUseCases.find(wallet.subscription.next.id)
	if (!subscription || !subscription.active) return await deactivateSub(wallet.id)
	const { results: methods } = await MethodsUseCases.get({
		where: [{ field: 'userId', value: userId }, { field: 'primary', value: true }]
	})
	const method = methods.at(0)
	if (!method) return await deactivateSub(wallet.id)
	const successful = await chargeForSubscription(user, subscription, method)
	return successful ? activateSub(userId, wallet.id, subscription) : await deactivateSub(wallet.id)
}

export const cancelSubscription = async (userId: string) => {
	const wallet = await WalletsUseCases.get(userId)
	return await WalletsUseCases.updateSubscription({
		id: wallet.id, data: { next: null }
	})
}