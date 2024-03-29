import { NotificationType, sendNotification } from '@modules/notifications'
import { canAccessOrgClasses } from '@modules/organizations'
import { UserEntity, UsersUseCases } from '@modules/users'
import { appInstance } from '@utils/types'
import { BadRequestError, DelayedJobs } from 'equipped'
import { FlutterwavePayment, MethodsUseCases, PlansUseCases, TransactionsUseCases, WalletsUseCases } from '..'
import { MethodEntity } from '../domain/entities/methods'
import { PurchaseEntity } from '../domain/entities/purchases'
import { WalletEntity } from '../domain/entities/wallets'
import { Interval, SelectedPaymentMethod, Subscription, TransactionStatus, TransactionType } from '../domain/types'

type PlanSubscribable = { type: 'plans'; planId: string }
type Subscribable = Subscription['data'] | PlanSubscribable
type Sub = Awaited<ReturnType<(typeof Subscriptions)['verify']>>
class SubError extends Error {
	constructor(
		readonly sub: Sub | null,
		message: string,
	) {
		super(message)
	}
}

const charge = async (user: UserEntity, sub: Sub, data: Subscribable, method: MethodEntity | true) => {
	if (sub.amount <= 0) return true
	try {
		const transaction = await TransactionsUseCases.create({
			userId: user.id,
			email: user.bio.email,
			amount: 0 - sub.amount,
			currency: sub.currency,
			status: TransactionStatus.initialized,
			title: `Subscription charge for ${sub.title}`,
			data:
				data.type === 'plans'
					? { type: TransactionType.subscription, subscriptionId: data.planId, multiplier: sub.multiplier ?? 1 }
					: { type: TransactionType.genericSubscription, data },
		})
		const successful =
			method === true
				? await WalletsUseCases.updateAmount({
						userId: transaction.userId,
						amount: transaction.amount,
						currency: transaction.currency,
					})
				: await FlutterwavePayment.chargeCard({
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
		if (successful && sub.type === 'classes' && data.type === 'classes') {
			const serviceCharge = PurchaseEntity.serviceCharge
			await TransactionsUseCases.create({
				userId: data.organizationId,
				email: sub.orgEmail,
				amount: Math.ceil((1 - serviceCharge) * sub.amount),
				currency: sub.currency,
				status: TransactionStatus.fulfilled,
				title: `Subscription payment for ${sub.title}`,
				data: {
					type: TransactionType.classSubscriptionPayment,
					organizationId: data.organizationId,
					classId: data.classId,
					userId: user.id,
					serviceCharge,
				},
			})
		}
		return successful
	} catch {
		return false
	}
}

const deactivate = async (userId: string, wallet: WalletEntity, data: Subscribable, sub: Sub | null) => {
	if (sub)
		await sendNotification([userId], {
			title: `Subscription to ${sub.title} failed`,
			body: `Your subscription to ${sub.title} failed to be activated`,
			data:
				data.type === 'plans'
					? { type: NotificationType.SubscriptionFailed, planId: data.planId }
					: { type: NotificationType.GenericSubscriptionFailed, data },
			sendEmail: true,
		})
	if (data.type === 'plans')
		return await WalletsUseCases.updateSubscription({
			id: wallet.id,
			data: { active: false, next: null },
		})
	const oldSub = wallet.getSubscription(data)
	if (!oldSub) return wallet
	return await WalletsUseCases.updateSubscriptions({
		id: wallet.id,
		subscription: { active: false, methodId: oldSub.methodId, current: oldSub.current, next: null, data },
	})
}

export class Subscriptions {
	static async #run(
		userId: string,
		methodId: SelectedPaymentMethod,
		data: Subscribable,
		wallet: WalletEntity,
		onFail: (userId: string, wallet: WalletEntity, data: Subscribable, sub: Sub | null, error: string) => Promise<WalletEntity>,
		oldJobId: string | null,
	) {
		try {
			const user = await UsersUseCases.find(userId)
			if (!user || user.isDeleted()) throw new SubError(null, 'profile not found')
			if (!user.type) throw new SubError(null, 'complete your profile before you subscribe')

			const sub = await Subscriptions.verify(data, wallet, user)

			const payWithWallet = methodId === true
			const method = await MethodsUseCases.getForUser(userId, methodId)
			if (!method && !payWithWallet) throw new SubError(sub, 'no method found')

			const successful = await charge(user, sub, data, method ?? true)
			if (!successful) throw new SubError(sub, 'charge failed')

			const now = Date.now() + 3000
			const renewedAt = wallet.getNextCharge(sub.interval, now)
			const jobId = await appInstance.job.addDelayedJob(
				data.type === 'plans'
					? { type: DelayedJobs.RenewSubscription, data: { userId } }
					: { type: DelayedJobs.RenewGenericSubscription, data: { userId, data } },
				renewedAt - now,
			)
			await sendNotification([userId], {
				title: `Subscription to ${sub.title} successful`,
				body: `Your subscription to ${sub.title} has been activated successfully`,
				data:
					data.type === 'plans'
						? { type: NotificationType.SubscriptionSuccessful, planId: data.planId }
						: { type: NotificationType.GenericSubscriptionSuccessful, data },
				sendEmail: true,
			})
			if (oldJobId) await appInstance.job.removeDelayedJob(oldJobId)
			if (data.type === 'plans')
				return await WalletsUseCases.updateSubscription({
					id: wallet.id,
					data: {
						active: true,
						methodId,
						current: { id: data.planId, activatedAt: now, expiredAt: renewedAt, jobId },
						next: { id: data.planId, renewedAt },
						data: sub.data,
						membersDays: 0,
					},
				})
			return await WalletsUseCases.updateSubscriptions({
				id: wallet.id,
				subscription: {
					active: true,
					methodId,
					current: { activatedAt: now, expiredAt: renewedAt, jobId },
					next: { renewedAt },
					data,
				},
			})
		} catch (error: any) {
			const sub = error instanceof SubError ? error.sub : null
			return await onFail(userId, wallet, data, sub, error.message)
		}
	}

	static async verify(data: Subscribable, wallet: WalletEntity, user: UserEntity) {
		if (data.type === 'classes') {
			const interval: Interval = 'monthly'
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
			if (!access) throw new Error('class not found')
			const org = await UsersUseCases.find(data.organizationId)
			if (!org) throw new Error('class owner not found')
			return {
				type: data.type,
				amount: access.role ? 0 : access.class.price.amount,
				currency: access.class.price.currency,
				title: access.class.title,
				interval,
				orgEmail: org.bio.email,
			}
		}
		if (data.type === 'plans') {
			const plan = await PlansUseCases.find(data.planId)
			if (!plan) throw new Error('plan not found')
			if (plan.amount === 0) throw new Error('you cant subscribe to this plan')
			if (!plan.active) throw new Error('you cant subscribe to this plan currently')
			if (!plan.usersFor.includes(user.type?.type as any)) throw new Error('you cant subscribe to this plan')
			const multiplier = user.isOrg() ? wallet.subscription.membersDays / plan.lengthInDays : 1
			return {
				type: data.type,
				amount: plan.amount * multiplier,
				currency: plan.currency,
				title: plan.title,
				interval: plan.interval,
				data: plan.data,
				planId: plan.id,
				multiplier,
			}
		}
		throw new Error('cannot initiate subscription')
	}

	static async createGeneric(userId: string, data: Subscription['data'], methodId: SelectedPaymentMethod) {
		const wallet = await WalletsUseCases.get(userId)
		const sub = wallet.getSubscription(data)
		if (sub?.active) return wallet
		return Subscriptions.#run(
			userId,
			methodId,
			data,
			wallet,
			(_, __, ___, ____, error) => {
				throw new BadRequestError(error)
			},
			sub?.current?.jobId ?? null,
		)
	}

	static async renewGeneric(userId: string, data: Subscription['data']) {
		const wallet = await WalletsUseCases.get(userId)
		const sub = wallet.getSubscription(data)
		if (!sub?.next) return deactivate(userId, wallet, data, null)
		return Subscriptions.#run(userId, sub.methodId, data, wallet, deactivate, sub.current?.jobId ?? null)
	}

	static async cancelGeneric(userId: string, subscriptionData: Subscription['data']) {
		const wallet = await WalletsUseCases.get(userId)
		return deactivate(userId, wallet, subscriptionData, null)
	}

	static async createPlan(userId: string, planId: string, methodId: SelectedPaymentMethod) {
		const wallet = await WalletsUseCases.get(userId)
		if (wallet.subscription.active) return wallet
		return Subscriptions.#run(
			userId,
			methodId,
			{ type: 'plans', planId },
			wallet,
			(_, __, ___, ____, error) => {
				throw new BadRequestError(error)
			},
			wallet.subscription.current?.jobId ?? null,
		)
	}

	static async renewPlan(userId: string) {
		const wallet = await WalletsUseCases.get(userId)
		const data = {
			type: 'plans' as const,
			planId: wallet.subscription.next?.id ?? '',
		}
		if (!wallet.subscription.next) return deactivate(userId, wallet, data, null)
		return Subscriptions.#run(
			userId,
			wallet.subscription.methodId,
			data,
			wallet,
			deactivate,
			wallet.subscription.current?.jobId ?? null,
		)
	}
}
