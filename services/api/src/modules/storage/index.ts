import { isDev } from '@utils/environment'
import { CloudUploaderRepository } from './data/repositories/cloudUploader'
import { LocalUploaderRepository } from './data/repositories/localUploader'
import { UploaderUseCase } from './domain/useCases/uploader'

const uploaderRepository = isDev ? new LocalUploaderRepository() : new CloudUploaderRepository()

export const UploaderUseCases = new UploaderUseCase(uploaderRepository)