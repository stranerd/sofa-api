import { ConversationRepository } from './data/repositories/conversations'
import { MessageRepository } from './data/repositories/messages'
import { ConversationsUseCase } from './domain/useCases/conversations'
import { MessagesUseCase } from './domain/useCases/messages'

const conversationRepository = ConversationRepository.getInstance()
const messageRepository = MessageRepository.getInstance()

export const ConversationsUseCases = new ConversationsUseCase(conversationRepository)
export const MessagesUseCases = new MessagesUseCase(messageRepository)

export { canAccessConversation } from './utils'
