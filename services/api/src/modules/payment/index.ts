import { MethodRepository } from './data/repositories/methods'
import { PlanRepository } from './data/repositories/plans'
import { TransactionRepository } from './data/repositories/transactions'
import { WalletRepository } from './data/repositories/wallets'
import { MethodsUseCase } from './domain/useCases/methods'
import { PlansUseCase } from './domain/useCases/plans'
import { TransactionsUseCase } from './domain/useCases/transactions'
import { WalletsUseCase } from './domain/useCases/wallets'

const planRepository = PlanRepository.getInstance()
const transactionRepository = TransactionRepository.getInstance()
const methodRepository = MethodRepository.getInstance()
const walletRepository = WalletRepository.getInstance()

export const PlansUseCases = new PlansUseCase(planRepository)
export const TransactionsUseCases = new TransactionsUseCase(transactionRepository)
export const MethodsUseCases = new MethodsUseCase(methodRepository)
export const WalletsUseCases = new WalletsUseCase(walletRepository)

export { Currencies, CurrencyCountries, TransactionStatus, TransactionType } from './domain/types'
export { FlutterwavePayment } from './utils/flutterwave'
export { cancelSubscription, renewSubscription, subscribeToPlan } from './utils/subscriptions'
export { retryTransactions } from './utils/transactions'
