import { CommentRepository } from './data/repositories/comments'
import { LikeRepository } from './data/repositories/likes'
import { TagRepository } from './data/repositories/tags'
import { ViewRepository } from './data/repositories/views'
import { CommentsUseCase } from './domain/useCases/comments'
import { LikesUseCase } from './domain/useCases/likes'
import { TagsUseCase } from './domain/useCases/tags'
import { ViewsUseCase } from './domain/useCases/views'

const commentRepository = CommentRepository.getInstance()
const likeRepository = LikeRepository.getInstance()
const viewRepository = ViewRepository.getInstance()
const tagRepository = TagRepository.getInstance()

export const CommentsUseCases = new CommentsUseCase(commentRepository)
export const LikesUseCases = new LikesUseCase(likeRepository)
export const ViewsUseCases = new ViewsUseCase(viewRepository)
export const TagsUseCases = new TagsUseCase(tagRepository)

export { InteractionEntities, TagTypes } from './domain/types'
export { verifyInteractionAndGetUserId } from './utils'
