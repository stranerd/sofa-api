import { MethodRepository } from './data/repositories/methods'
import { PlanRepository } from './data/repositories/plans'
import { PurchaseRepository } from './data/repositories/purchases'
import { TransactionRepository } from './data/repositories/transactions'
import { WalletRepository } from './data/repositories/wallets'
import { MethodsUseCase } from './domain/useCases/methods'
import { PlansUseCase } from './domain/useCases/plans'
import { PurchasesUseCase } from './domain/useCases/purchases'
import { TransactionsUseCase } from './domain/useCases/transactions'
import { WalletsUseCase } from './domain/useCases/wallets'

const planRepository = PlanRepository.getInstance()
const purchaseRepository = PurchaseRepository.getInstance()
const transactionRepository = TransactionRepository.getInstance()
const methodRepository = MethodRepository.getInstance()
const walletRepository = WalletRepository.getInstance()

export const PlansUseCases = new PlansUseCase(planRepository)
export const PurchasesUseCases = new PurchasesUseCase(purchaseRepository)
export const TransactionsUseCases = new TransactionsUseCase(transactionRepository)
export const MethodsUseCases = new MethodsUseCase(methodRepository)
export const WalletsUseCases = new WalletsUseCase(walletRepository)

export { Currencies, PlanDataType, Purchasables, Saleable, TransactionStatus, TransactionType } from './domain/types'
export { FlutterwavePayment } from './utils/flutterwave'
export { findPurchasable } from './utils/purchases'
export { cancelSubscription, renewSubscription, subscribeToPlan } from './utils/subscriptions'
export { retryTransactions } from './utils/transactions'
