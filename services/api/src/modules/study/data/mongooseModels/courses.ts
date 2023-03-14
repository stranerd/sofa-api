import { appInstance } from '@utils/types'
import { PublishableSchema, SaleableSchema } from '.'
import { CourseDbChangeCallbacks } from '../../utils/changes/courses'
import { CourseMapper } from '../mappers/courses'
import { CourseFromModel } from '../models/courses'

const Schema = new appInstance.dbs.mongo.Schema<CourseFromModel>({
	...PublishableSchema,
	...SaleableSchema
}, { timestamps: { currentTime: Date.now }, minimize: false })

export const Course = appInstance.dbs.mongo.use('study').model<CourseFromModel>('Course', Schema)

export const CourseChange = appInstance.dbs.mongo.change(Course, CourseDbChangeCallbacks, new CourseMapper().mapFrom)