import { TagsUseCases } from '@modules/interactions'
import { AI } from '@utils/ai'
import { Conditions } from 'equipped'
import { QuizEntity } from '../domain/entities/quizzes'
import { QuestionData, QuestionTypes } from '../domain/types'
import { QuestionsUseCases } from '../init'

export const questionsLimits = {
	[QuestionTypes.multipleChoice]: { min: 2, max: 6 },
	[QuestionTypes.trueOrFalse]: {},
	[QuestionTypes.writeAnswer]: { min: 1, max: 6 },
	[QuestionTypes.fillInBlanks]: { min: 2, max: 6 },
	[QuestionTypes.dragAnswers]: { min: 2, max: 6 },
	[QuestionTypes.sequence]: { min: 2, max: 6 },
	[QuestionTypes.match]: { min: 2, max: 10 },
}

type TypeParser = {
	getPrompt: () => { prompt: string; schema: Record<string, any> }
	getQuestionData: (data: any) => QuestionData
}

const indicator = '-------------'
const commonBlankParser = (type: QuestionTypes.fillInBlanks | QuestionTypes.dragAnswers): TypeParser => ({
	getPrompt: () => ({
		prompt: `The question needs to have at least ${questionsLimits[type].min} and at most ${questionsLimits[type].max} blanks spots. Use '${indicator}' as an indicator for where an option should be filled in the question. Each blank spot should correspond to a very short unique concise option in the options array in the right order.`,
		schema: {
			options: {
				type: 'array',
				items: { type: 'string' },
			},
		},
	}),
	getQuestionData: (data) => ({
		type,
		indicator,
		answers: data.options,
	}),
})

const parsers: Record<string, TypeParser> = {
	[QuestionTypes.multipleChoice]: {
		getPrompt: () => ({
			prompt: `The question needs to be multiple choice. Generate at least 4 and at most ${questionsLimits.multipleChoice.max} concise unique options with one or more correct answers with the correct answers indexes in the answers array.`,
			schema: {
				options: {
					type: 'array',
					items: { type: 'string' },
				},
				answers: {
					type: 'array',
					items: { type: 'number' },
				},
			},
		}),
		getQuestionData: (data) => ({
			type: QuestionTypes.multipleChoice,
			options: data.options,
			answers: data.answers,
		}),
	},
	[QuestionTypes.trueOrFalse]: {
		getPrompt: () => ({
			prompt: `The question needs to be true or false. Include the correct answer in the answer field.`,
			schema: {
				answer: { type: 'boolean' },
			},
		}),
		getQuestionData: (data) => ({
			type: QuestionTypes.trueOrFalse,
			answer: data.answer,
		}),
	},
	[QuestionTypes.writeAnswer]: {
		getPrompt: () => ({
			prompt: `The question needs to have very short answers. Include at least ${questionsLimits.writeAnswer.min} and at most ${questionsLimits.writeAnswer.max} possible variants of the answer in the answers field, with the first one being the most common solution.`,
			schema: {
				answers: {
					type: 'array',
					items: { type: 'string' },
				},
			},
		}),
		getQuestionData: (data) => ({
			type: QuestionTypes.writeAnswer,
			answers: data.answers,
		}),
	},
	[QuestionTypes.fillInBlanks]: commonBlankParser(QuestionTypes.fillInBlanks),
	[QuestionTypes.dragAnswers]: commonBlankParser(QuestionTypes.dragAnswers),
	[QuestionTypes.sequence]: {
		getPrompt: () => ({
			prompt: `The question needs to be of the format arrange the options in a particlar order. Provide at least ${questionsLimits.sequence.min} and at most ${questionsLimits.sequence.max} unique and concise options in the correct order`,
			schema: {
				options: {
					type: 'array',
					items: { type: 'string' },
				},
			},
		}),
		getQuestionData: (data) => ({
			type: QuestionTypes.sequence,
			answers: data.options,
		}),
	},
	[QuestionTypes.match]: {
		getPrompt: () => ({
			prompt: `The question needs to be of the format match the answer to the question in the options. Provide at least 4 and at most ${questionsLimits.match.max} matching pairs of related options where q is a unique concise fact or question and a is the concise answer.`,
			schema: {
				options: {
					type: 'array',
					items: {
						type: 'object',
						properties: {
							q: { type: 'string' },
							a: { type: 'string' },
						},
						required: ['q', 'a'],
						additionalProperties: false,
					},
				},
			},
		}),
		getQuestionData: (data) => ({
			type: QuestionTypes.match,
			set: data.options.map((q) => ({ q: q.q, a: q.a })),
		}),
	},
}

export const generateQuestions = async ({
	quiz,
	userId,
	amount,
	questionType,
}: {
	quiz: QuizEntity
	userId: string
	amount: number
	questionType: QuestionTypes
}) => {
	const { results: tags } = await TagsUseCases.get({
		where: [{ field: 'id', condition: Conditions.in, value: quiz.tagIds }],
		all: true,
	})

	const type = parsers[questionType]
	if (!type) return []

	const { prompt, schema: schemaProperties } = type.getPrompt()

	const content = [
		`Generate ${amount} questions based on the topic "${quiz.title}", description "${quiz.description}" and tags - ${tags.map((t) => t.title).join(', ')}.`,
		`For each question:  Include a detailed explanation of the solution.`,
		prompt,
		`Do not include any bullet indicators or labels for the question, explanation or any of the options or answers. Do not start the explanation with Explanation or any other indicator. Do not start the questionBody with any indicator as well`,
	].join(' ')

	const response = await AI.generateQuestion<{ questions: (Record<string, any> & { questionBody: string; explanation: string })[] }>(
		content,
		{
			type: 'object',
			properties: {
				questions: {
					type: 'array',
					items: {
						type: 'object',
						properties: {
							questionBody: { type: 'string' },
							explanation: { type: 'string' },
							...schemaProperties,
						},
						required: Object.keys(schemaProperties).concat('questionBody', 'explanation'),
						additionalProperties: false,
					},
				},
			},
			required: ['questions'],
			additionalProperties: false,
		},
	)

	if (!response) return []

	return QuestionsUseCases.addMany(
		response.questions.map((q) => ({
			question: q.questionBody,
			questionMedia: null,
			explanation: q.explanation,
			data: type.getQuestionData(q),
			userId,
			quizId: quiz.id,
			timeLimit: 30,
			isAiGenerated: true,
		})),
	)
}
