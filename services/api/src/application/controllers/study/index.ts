import { TagsUseCases } from '@modules/interactions'
import { BadRequestError, Conditions } from 'equipped'

export const verifyTags = async (topicId: string, tagIds: string[]) => {
	const tag = await TagsUseCases.find(topicId)
	if (!tag || !tag.isTopic()) throw new BadRequestError('invalid tag')

	const { results: tags } = await TagsUseCases.get({
		where: [{ field: 'id', condition: Conditions.in, value: tagIds }],
		all: true
	})

	const filteredTagIds = tags.filter((tag) => tag.isGeneric())
		.map((tag) => tag.id)

	return { topicId, tagIds: filteredTagIds }
}