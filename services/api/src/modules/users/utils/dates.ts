export const getDateDifference = (date1: Date, date2: Date) => {
	const isSameDay = (date1: Date, date2: Date) => date1.getDate() === date2.getDate() &&
		date1.getMonth() === date2.getMonth() &&
		date1.getFullYear() === date2.getFullYear()
	const res = { isLessThan: false, isNextDay: false }
	res.isLessThan = date2 <= date1 || isSameDay(date1, date2)
	const start = new Date(
		date1.getFullYear(),
		date1.getMonth(),
		date1.getDate() + 2,
		0, 0, 0
	)
	res.isNextDay = date2 < start
	return res
}
