import { Conditions } from 'equipped'
import { MethodsUseCases, TransactionsUseCases, WalletsUseCases } from '../'
import { TransactionEntity } from '../domain/entities/transactions'
import { Currencies, TransactionStatus, TransactionType } from '../domain/types'
import { FlutterwavePayment } from './flutterwave'

export const fulfillTransaction = async (transaction: TransactionEntity) => {
	if (transaction.data.type === TransactionType.newCard) {
		const method = await FlutterwavePayment.saveCard(transaction.userId, transaction.id)
		if (!method) return
		await MethodsUseCases.create(method)
		await WalletsUseCases.updateAmount({
			userId: transaction.userId,
			amount: await FlutterwavePayment.convertAmount(transaction.amount, transaction.currency, Currencies.NGN)
		})
		await TransactionsUseCases.update({
			id: transaction.id,
			data: { status: TransactionStatus.settled }
		})
	}
}

export const retryTransactions = async (timeInMs: number) => {
	const { results: fulfilledTransactions } = await TransactionsUseCases.get({
		where: [
			{ field: 'status', value: TransactionStatus.fulfilled },
			{ field: 'createdAt', condition: Conditions.gt, value: Date.now() - timeInMs }
		],
		all: true
	})
	await Promise.all(fulfilledTransactions.map(fulfillTransaction))

	const { results: initializedTransactions } = await TransactionsUseCases.get({
		where: [
			{ field: 'status', value: TransactionStatus.initialized },
			{ field: 'createdAt', condition: Conditions.gt, value: Date.now() - timeInMs }
		],
		all: true
	})
	await TransactionsUseCases.delete(initializedTransactions.map((t) => t.id))
}