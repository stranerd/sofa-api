import { ConversationRepository } from './data/repositories/conversations'
import { MessageRepository } from './data/repositories/messages'
import { ReviewRepository } from './data/repositories/reviews'
import { TutorRequestRepository } from './data/repositories/tutorRequests'
import { ConversationsUseCase } from './domain/useCases/conversations'
import { MessagesUseCase } from './domain/useCases/messages'
import { ReviewsUseCase } from './domain/useCases/reviews'
import { TutorRequestsUseCase } from './domain/useCases/tutorRequests'

const conversationRepository = ConversationRepository.getInstance()
const messageRepository = MessageRepository.getInstance()
const reviewRepository = ReviewRepository.getInstance()
const tutorRequestRepository = TutorRequestRepository.getInstance()

export const ConversationsUseCases = new ConversationsUseCase(conversationRepository)
export const MessagesUseCases = new MessagesUseCase(messageRepository)
export const ReviewsUseCases = new ReviewsUseCase(reviewRepository)
export const TutorRequestsUseCases = new TutorRequestsUseCase(tutorRequestRepository)

export { canAccessConversation } from './utils'
