import { youtubeConfig } from '@utils/environment'
import { google } from 'googleapis'
import { ScheduleEntity } from '../domain/entities/schedules'
import { ScheduleStream } from '../domain/types'

export const createLiveStream = async (schedule: ScheduleEntity): Promise<ScheduleStream> => {
	const OAuth2Client = new google.auth.OAuth2(youtubeConfig.clientId, youtubeConfig.clientSecret)
	OAuth2Client.setCredentials({ refresh_token: youtubeConfig.refreshToken })

	const youtube = google.youtube({ version: 'v3', auth: OAuth2Client })

	const { data: broadcast } = await youtube.liveBroadcasts.insert({
		part: ['id', 'snippet', 'contentDetails', 'monetizationDetails', 'status'],
		requestBody: {
			snippet: {
				title: schedule.title,
				scheduledStartTime: new Date(schedule.time.start).toISOString(),
				scheduledEndTime: new Date(schedule.time.end).toISOString(),
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
		roomId: `${schedule.title}-${schedule.id}`.replace(/[^a-zA-Z0-9]/g, ''),
	}
}
