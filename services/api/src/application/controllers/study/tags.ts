import { TagTypes, TagsUseCases } from '@modules/interactions'
import { BadRequestError } from 'equipped'

export const verifyTags = async (topic: string, genericTagTitles: string[]) => {
	const [tag] = await TagsUseCases.autoCreate({ type: TagTypes.topics, titles: [topic] })
	if (!tag || !tag.isTopic()) throw new BadRequestError('invalid topic')

	const tags = await TagsUseCases.autoCreate({ type: TagTypes.generic, titles: genericTagTitles })
	const filteredTagIds = tags.filter((tag) => tag.isGeneric())
		.map((tag) => tag.id)

	return { topicId: tag.id, tagIds: filteredTagIds }
}