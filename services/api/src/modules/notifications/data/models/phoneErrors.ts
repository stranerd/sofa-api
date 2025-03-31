export interface PhoneErrorFromModel extends PhoneErrorToModel {
	_id: string
	tries: number
	createdAt: number
	updatedAt: number
}

export interface PhoneErrorToModel {
	error: string
	to: string
	content: string
	from: string
}
