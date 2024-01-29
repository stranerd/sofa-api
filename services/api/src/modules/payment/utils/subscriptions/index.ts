import { NotificationType, sendNotification } from '@modules/notifications'
import { MembersUseCases } from '@modules/organizations'
import { UserEntity, UsersUseCases } from '@modules/users'
import { appInstance } from '@utils/types'
import { BadRequestError, DelayedJobs } from 'equipped'
import { MethodsUseCases, PlansUseCases, TransactionsUseCases, WalletsUseCases } from '../..'
import { MethodEntity } from '../../domain/entities/methods'
import { PlanEntity } from '../../domain/entities/plans'
import { WalletEntity } from '../../domain/entities/wallets'
import { TransactionStatus, TransactionType } from '../../domain/types'
import { FlutterwavePayment } from '../flutterwave'

const getSubscriptionMultipier = async (user: UserEntity, wallet: WalletEntity, subscription: PlanEntity) => {
	if (!user.isOrg()) return 1
	return wallet.subscription.membersDays / subscription.getLengthInDays()
}

const activateSub = async (userId: string, wallet: WalletEntity, plan: PlanEntity) => {
	const now = Date.now()
	const renewedAt = wallet.getNextCharge(plan.interval, now)
	const jobId = await appInstance.job.addDelayedJob(
		{
			type: DelayedJobs.RenewSubscription,
			data: { userId },
		},
		renewedAt - now,
	)
	await sendNotification([userId], {
		title: `Subscription to ${plan.title} successful`,
		body: `Your subscription to ${plan.title} has been activated successfully`,
		data: { type: NotificationType.SubscriptionSuccessful, planId: plan.id },
		sendEmail: true,
	})
	return await WalletsUseCases.updateSubscription({
		id: wallet.id,
		data: {
			active: true,
			current: { id: plan.id, activatedAt: now, expiredAt: renewedAt, jobId },
			next: { id: plan.id, renewedAt },
			data: plan.data,
			membersDays: 0,
		},
	})
}

const deactivateSub = async (userId: string, walletId: string, plan: PlanEntity | null) => {
	if (plan)
		await sendNotification([userId], {
			title: `Subscription to ${plan.title} failed`,
			body: `Your subscription to ${plan.title} failed to be activated`,
			data: { type: NotificationType.SubscriptionFailed, planId: plan.id },
			sendEmail: true,
		})
	return await WalletsUseCases.updateSubscription({
		id: walletId,
		data: { active: false, next: null },
	})
}

const chargeForSubscription = async (user: UserEntity, plan: PlanEntity, method: MethodEntity, wallet: WalletEntity) => {
	try {
		const multiplier = await getSubscriptionMultipier(user, wallet, plan)
		const amount = plan.amount * multiplier
		const transaction = await TransactionsUseCases.create({
			userId: user.id,
			email: user.bio.email,
			amount: 0 - amount,
			currency: plan.currency,
			status: TransactionStatus.initialized,
			title: `Subscription charge for ${plan.title}`,
			data: { type: TransactionType.subscription, subscriptionId: plan.id, multiplier },
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

export const subscribeToPlan = async (userId: string, subscriptionId: string) => {
	const wallet = await WalletsUseCases.get(userId)
	if (wallet.subscription.active) return wallet
	const user = await UsersUseCases.find(userId)
	if (!user || user.isDeleted()) throw new BadRequestError('profile not found')
	if (!user.type) throw new BadRequestError('complete your profile before you subscribe')
	const plan = await PlansUseCases.find(subscriptionId)
	if (!plan) throw new BadRequestError('subscription not found')
	if (!plan.active) throw new BadRequestError('you can\'t subscribe to this plan currently')
	if (!plan.usersFor.includes(user.type.type)) throw new BadRequestError('you can\'t subscribe to this plan')
	const { results: methods } = await MethodsUseCases.get({
		where: [
			{ field: 'userId', value: userId },
			{ field: 'primary', value: true },
		],
	})
	const method = methods.at(0)
	if (!method) throw new BadRequestError('no method found')
	const successful = await chargeForSubscription(user, plan, method, wallet)
	if (!successful) throw new BadRequestError('charge failed')
	return activateSub(userId, wallet, plan)
}

export const renewPlanSubscription = async (userId: string) => {
	const wallet = await WalletsUseCases.get(userId)
	if (!wallet.subscription.next) return await deactivateSub(userId, wallet.id, null)
	const user = await UsersUseCases.find(userId)
	if (!user || user.isDeleted()) return await deactivateSub(userId, wallet.id, null)
	const plan = await PlansUseCases.find(wallet.subscription.next.id)
	if (!plan || !plan.active) return await deactivateSub(userId, wallet.id, null)
	const { results: methods } = await MethodsUseCases.get({
		where: [
			{ field: 'userId', value: userId },
			{ field: 'primary', value: true },
		],
	})
	const method = methods.at(0)
	if (!method) return await deactivateSub(userId, wallet.id, plan)
	const successful = await chargeForSubscription(user, plan, method, wallet)
	return successful ? activateSub(userId, wallet, plan) : await deactivateSub(userId, wallet.id, plan)
}

export const updateOrgsMembersDays = async () => {
	const records = await MembersUseCases.aggregateMembersDays()
	await WalletsUseCases.updateMembersDays(records)
}
