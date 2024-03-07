import { MethodRepository } from './data/repositories/methods'
import { PlanRepository } from './data/repositories/plans'
import { PurchaseRepository } from './data/repositories/purchases'
import { TransactionRepository } from './data/repositories/transactions'
import { WalletRepository } from './data/repositories/wallets'
import { WithdrawalRepository } from './data/repositories/withdrawals'
import { MethodsUseCase } from './domain/useCases/methods'
import { PlansUseCase } from './domain/useCases/plans'
import { PurchasesUseCase } from './domain/useCases/purchases'
import { TransactionsUseCase } from './domain/useCases/transactions'
import { WalletsUseCase } from './domain/useCases/wallets'
import { WithdrawalsUseCase } from './domain/useCases/withdrawals'

const planRepository = PlanRepository.getInstance()
const purchaseRepository = PurchaseRepository.getInstance()
const transactionRepository = TransactionRepository.getInstance()
const methodRepository = MethodRepository.getInstance()
const walletRepository = WalletRepository.getInstance()
const withdrawalRepository = WithdrawalRepository.getInstance()

export const PlansUseCases = new PlansUseCase(planRepository)
export const PurchasesUseCases = new PurchasesUseCase(purchaseRepository)
export const TransactionsUseCases = new TransactionsUseCase(transactionRepository)
export const MethodsUseCases = new MethodsUseCase(methodRepository)
export const WalletsUseCases = new WalletsUseCase(walletRepository)
export const WithdrawalsUseCases = new WithdrawalsUseCase(withdrawalRepository)

export {
	Currencies,
	CurrencyCountries,
	PlanDataType,
	Purchasables,
	Saleable,
	Subscription,
	TransactionStatus,
	TransactionType,
} from './domain/types'
export type { SelectedPaymentMethod } from './domain/types'
export { FlutterwavePayment } from './utils/flutterwave'
export { updateOrgsMembersDays } from './utils/plans'
export { findPurchasable } from './utils/purchases'
export { Subscriptions } from './utils/subscriptions'
export { fulfillTransaction, processTransactions } from './utils/transactions'
export { processWithdrawals } from './utils/withdrawals'
