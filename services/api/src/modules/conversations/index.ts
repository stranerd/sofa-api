import { ConversationRepository } from './data/repositories/conversations'
import { ConversationsUseCase } from './domain/useCases/conversations'

const conversationRepository = ConversationRepository.getInstance()

export const ConversationsUseCases = new ConversationsUseCase(conversationRepository)