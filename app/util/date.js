import moment from 'moment'

export const unserializeDate = (date = new Date) => {
	return moment(date).format('DD/MM/YYYY')
}

export const serializeDate = (date = new Date) => {
	return moment(date).format('YYYY-MM-DD')
}

export const getPeriodo = (periodo = 'month_start', format = true) => {

	let date = new Date

	// Seleciona o periodo
	switch (periodo) {
		case 'month_start':
			date = new Date(date.getFullYear(), date.getMonth(), 1)
			break
		case 'month_end':
			date = new Date(date.getFullYear(), date.getMonth() + 1, 0)
			break
		case 'week_start':
			date = new Date(date.setDate(date.getDate() - date.getDay()))
			break
		case 'week_end':
			date = new Date(date.setDate(date.getDate() + 6 - date.getDay()))
		case 'today': break
		default: break
	}

	// Entrega string formatada ou o objeto de Date
	if (format) {
		return date.toJSON().slice(0, 10)
	} else {
		return date
	}
}

export default {
	unserialize: unserializeDate,
	serialize: serializeDate,
	format: (date, format='DD/MM/YYY') => moment(date).format(format)
}