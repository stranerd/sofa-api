import { AI } from '@utils/ai'

import type { QuestionData } from '../domain/types'
import { QuestionTypes } from '../domain/types'

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

export const generateAiQuizAndQuestions = async ({
	finalPrompt,
	questionAmount,
	questionType,
}: {
	finalPrompt: string
	questionAmount: number
	questionType: QuestionTypes
}) => {
	const type = parsers[questionType]
	if (!type) throw new Error(`${questionType} questions not supported`)

	const { prompt, schema: schemaProperties } = type.getPrompt()

	const content = [
		`Generate a quiz with a concise title, a full description, a concise 1/2-word topic closely relevant to the title, 5 relevant tags, and ${questionAmount} questions, based off the following content`,
		`For each question: Include a detailed explanation of the solution.`,
		prompt,
		`Do not include any bullet indicators or labels for the question, explanation or any of the options or answers. Do not start the explanation with Explanation or any other indicator. Do not start the questionBody with any indicator as well.`,
		finalPrompt,
	].join('\n')

	const quizProperties = {
		title: { type: 'string' },
		description: { type: 'string' },
		topic: { type: 'string' },
		tags: {
			type: 'array',
			items: { type: 'string' },
		},
	}

	const response = await AI.getSchemaResponse<{
		quiz: { title: string; description: string; topic: string; tags: string[] }
		questions: (Record<string, any> & { questionBody: string; explanation: string })[]
	}>(content, {
		type: 'object',
		properties: {
			quiz: {
				type: 'object',
				properties: quizProperties,
				required: Object.keys(quizProperties),
				additionalProperties: false,
			},
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
		required: ['quiz', 'questions'],
		additionalProperties: false,
	})

	if (!response) throw new Error('failed to generate questions')
	return {
		quiz: {
			title: response.quiz.title,
			description: response.quiz.description,
			topic: response.quiz.topic,
			tags: response.quiz.tags,
		},
		questions: response.questions.map((q) => ({
			question: q.questionBody,
			questionMedia: null,
			explanation: q.explanation,
			data: type.getQuestionData(q),
		})),
	}
}
