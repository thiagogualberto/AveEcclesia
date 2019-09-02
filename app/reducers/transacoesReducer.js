import { getPeriodo } from '../util/date'

const initialState = {
	tab: { action: 'receitas' },
	thead: [],
	delete: [],
	rows: [],
	filtro: {
		limit: 20,
		order: 'desc',
		start_date: getPeriodo('month_start'),
		end_date: getPeriodo('month_end')
	}
}

export default function (state = initialState, action) {
	switch (action.type) {
		case 'FIELD_CHANGE':
			return { ...state, edit: {...state.edit, ...action.payload} }
		case 'SELECT_TAB':
			return { ...state, edit: undefined, rows: [], delete: [], tab: action.payload, loading: true }
		case 'TABLE_CHANGE':
			return { ...state, thead: action.payload }
		case 'NEXT_PAGE':
			return { ...state, filtro: action.payload }
		case 'LOAD_DATA':
			return { ...state, loading: false, delete: [], ...action.payload.data }
		case 'EDIT_DATA':
			return { ...state, edit: action.payload, rows: removeNull(state.rows) }
		case 'ADD_DATA':
			return { ...state, edit: action.payload, rows: removeNullAndAdd(state.rows, action.payload) }
		case 'SAVE_DATA':
			return { ...state, edit: undefined, rows: updateByRow(state.rows, action) }
		case 'CANCEL_EDIT':
			return { ...state, edit: undefined, rows: removeNull(state.rows) }
		case 'TOGGLE_QUITADO':
			return { ...state, rows: updateByRow(state.rows, action) }
		case 'TOGGLE_DELETE':
			return { ...state, delete: toggleRow(state.delete, action.payload) }
		case 'CHECK_ALL_DELETE':
			return { ...state, delete: action.payload }
		case 'FILTER_CHANGE':
			return { ...state, filtro: {...state.filtro, ...action.payload}}
		default:
			return state
	}
}

function toggleRow(array, rows) {

	if (!Array.isArray(rows)) {
		rows = [rows]
	}

	return [
		...rows.filter(row => !array.includes(row)),
		...array.filter(row => !rows.includes(row))
	]
}

function updateByRow(array, action) {

	// Resposta
	const resp = action.payload

	if (resp.data) {

		// Dados da resposta
		const data = resp.data.data

		// Caso for editar, então atualiza, senão concatena
		if (resp.config.method == 'put') {
			return array.map(row => row.id == data.id ? data : row)
		} else {
			return removeNullAndAdd(array, data)
		}
	}
}

function removeNullAndAdd(array, item) {

	array = removeNull(array)
	array.unshift(item)

	return array
}

function removeNull(array) {

	if (array[0] === undefined || array[0].id == 0) {
		array.shift()
	}

	return array
}