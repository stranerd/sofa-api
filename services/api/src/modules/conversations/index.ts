import { ConversationRepository } from './data/repositories/conversations'
import { MessageRepository } from './data/repositories/messages'
import { ReviewRepository } from './data/repositories/reviews'
import { ConversationsUseCase } from './domain/useCases/conversations'
import { MessagesUseCase } from './domain/useCases/messages'
import { ReviewsUseCase } from './domain/useCases/reviews'

const conversationRepository = ConversationRepository.getInstance()
const messageRepository = MessageRepository.getInstance()
const reviewRepository = ReviewRepository.getInstance()

export const ConversationsUseCases = new ConversationsUseCase(conversationRepository)
export const MessagesUseCases = new MessagesUseCase(messageRepository)
export const ReviewsUseCases = new ReviewsUseCase(reviewRepository)

export { canAccessConversation } from './utils'
