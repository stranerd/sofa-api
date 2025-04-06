import type { QueryParams, QueryResults } from 'equipped'

import type { ReportToModel } from '../../data/models/reports'
import type { ReportEntity } from '../entities/reports'
import type { EmbeddedUser, Interaction } from '../types'

export interface IReportRepository {
	find: (id: string) => Promise<ReportEntity | null>
	create: (data: ReportToModel) => Promise<ReportEntity>
	get(query: QueryParams): Promise<QueryResults<ReportEntity>>
	delete: (id: string) => Promise<boolean>
	updateUserBio: (user: EmbeddedUser) => Promise<boolean>
	deleteEntityReports: (entity: Interaction) => Promise<boolean>
}
