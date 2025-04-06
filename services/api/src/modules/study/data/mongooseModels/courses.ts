import { appInstance } from '@utils/types'

import { PublishableSchema, SaleableSchema } from '.'
import { CourseMeta } from '../../domain/types'
import { CourseDbChangeCallbacks } from '../../utils/changes/courses'
import { CourseMapper } from '../mappers/courses'
import type { CourseFromModel } from '../models/courses'

const Schema = new appInstance.dbs.mongo.Schema<CourseFromModel>(
	{
		sections: {
			type: [appInstance.dbs.mongo.Schema.Types.Mixed] as unknown as CourseFromModel['sections'],
			required: false,
			default: [],
		},
		meta: Object.fromEntries(
			Object.values(CourseMeta).map((meta) => [
				meta,
				{
					type: Number,
					required: false,
					default: 0,
				},
			]),
		),
		...PublishableSchema,
		...SaleableSchema,
	},
	{ timestamps: { currentTime: Date.now }, minimize: false },
)

export const Course = appInstance.dbs.mongo.use('study').model<CourseFromModel>('Course', Schema)

export const CourseChange = appInstance.dbs.mongo.change(Course, CourseDbChangeCallbacks, new CourseMapper().mapFrom)
