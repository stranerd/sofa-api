import { ConversationsUseCases } from '..'

export const canAccessConversation = async (conversationId: string, userId: string) => {
	const conversation = await ConversationsUseCases.find(conversationId)
	return conversation?.user.id === userId || conversation?.tutor?.id === userId ? conversation : null
}
