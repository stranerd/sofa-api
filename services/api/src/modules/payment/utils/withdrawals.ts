import { Conditions } from 'equipped'
import { TransactionsUseCases, WithdrawalsUseCases } from '..'
import { WithdrawalEntity } from '../domain/entities/withdrawals'
import { TransactionStatus, TransactionType, WithdrawalStatus } from '../domain/types'
import { FlutterwavePayment } from './flutterwave'

export const processCreatedWithdrawal = async (withdrawal: WithdrawalEntity) => {
	if (withdrawal.externalId || withdrawal.status !== WithdrawalStatus.created) return
	const externalId = await FlutterwavePayment.transfer({
		id: withdrawal.id,
		bankCode: withdrawal.account.bankCode,
		bankNumber: withdrawal.account.bankNumber,
		amount: withdrawal.amount,
		currency: withdrawal.currency,
	})

	if (!externalId) return
	await WithdrawalsUseCases.update({
		id: withdrawal.id,
		data: {	externalId, status: WithdrawalStatus.inProgress	}
	})
}

export const processInProgressWithdrawal = async (withdrawal: WithdrawalEntity) => {
	if (!withdrawal.externalId || withdrawal.status !== WithdrawalStatus.inProgress) return
	const status = await FlutterwavePayment.verifyTransferStatus(withdrawal.externalId)
	if (!status) return
	if (status === 'pending') return
	await WithdrawalsUseCases.update({
		id: withdrawal.id,
		data: {	status: status === 'successful' ? WithdrawalStatus.completed : WithdrawalStatus.failed	}
	})
}

export const processFailedWithdrawal = async (withdrawal: WithdrawalEntity) => {
	if (withdrawal.status !== WithdrawalStatus.failed) return
	await TransactionsUseCases.create({
		userId: withdrawal.userId,
		email: withdrawal.email,
		amount: withdrawal.getChargedAmount(),
		currency: withdrawal.currency,
		title: 'Withdrawal failed. Amount refunded to wallet',
		status: TransactionStatus.fulfilled,
		data: { type: TransactionType.withdrawalRefund, withdrawalId: withdrawal.id }
	})
	await WithdrawalsUseCases.update({
		id: withdrawal.id,
		data: {	status: WithdrawalStatus.refunded }
	})
}

export const processWithdrawals = async (timeInMs: number) => {
	const { results: createdWithdrawals } = await WithdrawalsUseCases.get({
		where: [
			{ field: 'status', value: WithdrawalStatus.created },
			{ field: 'createdAt', condition: Conditions.lt, value: Date.now() - timeInMs }
		],
		all: true
	})
	const { results: inProgressWithdrawals } = await WithdrawalsUseCases.get({
		where: [
			{ field: 'status', value: WithdrawalStatus.inProgress },
			{ field: 'createdAt', condition: Conditions.lt, value: Date.now() - timeInMs }
		],
		all: true
	})
	const { results: failedWithdrawals } = await WithdrawalsUseCases.get({
		where: [
			{ field: 'status', value: WithdrawalStatus.failed },
			{ field: 'createdAt', condition: Conditions.lt, value: Date.now() - timeInMs }
		],
		all: true
	})
	await Promise.all(createdWithdrawals.map(processCreatedWithdrawal))
	await Promise.all(inProgressWithdrawals.map(processInProgressWithdrawal))
	await Promise.all(failedWithdrawals.map(processFailedWithdrawal))
}