import { isProd } from '@utils/environment'
import { CloudUploaderRepository } from './data/repositories/cloudUploader'
import { LocalUploaderRepository } from './data/repositories/localUploader'
import { UploaderUseCase } from './domain/useCases/uploader'

const uploaderRepository = isProd ? new CloudUploaderRepository() : new LocalUploaderRepository()

export const UploaderUseCases = new UploaderUseCase(uploaderRepository)
