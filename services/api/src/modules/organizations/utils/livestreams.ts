import { google } from 'googleapis'

import { youtubeConfig } from '@utils/environment'

import type { ScheduleEntity } from '../domain/entities/schedules'
import type { ScheduleStream } from '../domain/types'

const getYoutubeClient = async () => {
	const OAuth2Client = new google.auth.OAuth2(youtubeConfig.clientId, youtubeConfig.clientSecret)
	OAuth2Client.setCredentials({ refresh_token: youtubeConfig.refreshToken })

	return google.youtube({ version: 'v3', auth: OAuth2Client })
}

export const createLiveStream = async (schedule: ScheduleEntity): Promise<ScheduleStream> => {
	const youtube = await getYoutubeClient()

	const { data: broadcast } = await youtube.liveBroadcasts.insert({
		part: ['id', 'snippet', 'contentDetails', 'monetizationDetails', 'status'],
		requestBody: {
			snippet: {
				title: schedule.title,
				scheduledStartTime: new Date().toISOString(),
			},
			status: {
				privacyStatus: 'unlisted',
			},
			contentDetails: {
				enableAutoStart: true,
				recordFromStart: true,
			},
		},
	})

	const { data: stream } = await youtube.liveStreams.insert({
		part: ['id', 'snippet', 'cdn', 'status', 'contentDetails'],
		requestBody: {
			snippet: {
				title: schedule.title,
			},
			cdn: {
				frameRate: 'variable',
				resolution: 'variable',
				ingestionType: 'rtmp',
			},
			contentDetails: {
				isReusable: true,
			},
		},
	})

	await youtube.liveBroadcasts.bind({
		id: broadcast.id!,
		part: ['id', 'snippet', 'status', 'contentDetails'],
		streamId: stream.id!,
	})

	return {
		broadcastId: broadcast.id!,
		streamId: stream.id!,
		streamKey: stream.cdn?.ingestionInfo?.streamName!,
		type: 'jitsi',
		roomId: `${schedule.title.replace(/[^a-zA-Z0-9]/g, '')}-${schedule.id}`,
		canRewatch: false,
	}
}

export const endLiveStream = async (schedule: ScheduleEntity) => {
	if (!schedule.stream) return false
	const youtube = await getYoutubeClient()
	await youtube.liveBroadcasts.transition({
		id: schedule.stream.broadcastId,
		part: ['id', 'snippet', 'status', 'contentDetails'],
		broadcastStatus: 'complete',
	})

	const { data: videos } = await youtube.videos.list({
		part: ['contentDetails', 'id', 'liveStreamingDetails', 'snippet'],
		id: [schedule.stream.broadcastId],
	})
	const video = videos.items?.[0]
	return !!video?.liveStreamingDetails?.actualStartTime
}
