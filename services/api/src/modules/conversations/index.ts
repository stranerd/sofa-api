import { ConversationRepository } from './data/repositories/conversations'
import { MessageRepository } from './data/repositories/messages'
import { TutorRequestRepository } from './data/repositories/tutorRequests'
import { ConversationsUseCase } from './domain/useCases/conversations'
import { MessagesUseCase } from './domain/useCases/messages'
import { TutorRequestsUseCase } from './domain/useCases/tutorRequests'

const conversationRepository = ConversationRepository.getInstance()
const messageRepository = MessageRepository.getInstance()
const tutorRequestRepository = TutorRequestRepository.getInstance()

export const ConversationsUseCases = new ConversationsUseCase(conversationRepository)
export const MessagesUseCases = new MessagesUseCase(messageRepository)
export const TutorRequestsUseCases = new TutorRequestsUseCase(tutorRequestRepository)

export { canAccessConversation } from './utils'
