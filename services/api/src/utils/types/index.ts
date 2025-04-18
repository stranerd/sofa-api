export type * from './push'

import { getEnvOrFail, Instance } from 'equipped'
import './enums'

Instance.initialize({
	accessTokenKey: getEnvOrFail('ACCESS_TOKEN_KEY'),
	refreshTokenKey: getEnvOrFail('REFRESH_TOKEN_KEY'),
	mongoDbURI: getEnvOrFail('MONGODB_URI'),
	redisURI: getEnvOrFail('REDIS_URI'),
	appId: getEnvOrFail('APP_ID'),
	kafkaURIs: getEnvOrFail('KAFKA_URIS').split(','),
	debeziumUrl: getEnvOrFail('DEBEZIUM_URL'),
	bullQueueName: 'task-queues',
	eventColumnName: 'SofaApis',
	server: 'fastify',
	openapiDocsBaseUrl: ['/api'],
})
export const appInstance = Instance.get()
