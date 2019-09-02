import api, { handler } from '../api'
import { loadResumo } from './contasAction'

export const nextPage = () => (dispatch, getState) => {

	let filtro = getState().transacoes.filtro

	let limit = filtro.limit || 10
	let offset = (filtro.offset || 0) + limit
	let page = Math.ceil(offset / limit) + 1

	filtro = {...filtro, limit, offset}

	dispatch({ type: 'NEXT_PAGE', payload: filtro})
	dispatch(loadData(page))
}

export const changeField = (name, value) => ({
	type: 'FIELD_CHANGE',
	payload: {[name]: value}
})

export const selectTab = tab => [
	{ type: 'SELECT_TAB', payload: tab },
	loadData()
]

export const tableChange = thead => ({
	type: 'TABLE_CHANGE',
	payload: thead
})

export const loadData = (page = 1) => (dispatch, getState) => {

	// Cancela os requests pendentes
	handler.cancel('New load called')
	
	// Pega o state e um novo token
	const state = getState().transacoes
	const token = handler.token

	// Busca os dados
	api.loadData(state.tab.action, state.filtro, token)
		.then(resp => {

			// Caso esteja paginando
			let payload = {}

			if (page === 1) {
				payload = resp
			} else {
				payload = { ...resp, data: { rows: [...state.rows, ...resp.data.rows] } }
			}

			dispatch({ type: 'LOAD_DATA', payload })
			dispatch(loadResumo()) // Atualiza o resumo

		})
		.catch(err => {
			dispatch({ type: 'LOAD_DATA', payload: { data: [] } })
		})
}

export const editData = row => ({
	type: 'EDIT_DATA',
	payload: row
})

export const addData = () => ({
	type: 'ADD_DATA',
	payload: { id: 0 }
})

export const deleteItem = (id) => (dispatch, getState) => {
	if (confirm('Você deseja realmente excluir esse registro?')) {
		const state = getState().transacoes
		api.deleteItem(state.tab.action, id)
			.then(() => dispatch(loadData()))
	}
}

export const deleteData = () => (dispatch, getState) => {
	const state = getState().transacoes
	api.deleteData(state.tab.action, state.delete)
		.then(() => dispatch(loadData())
	)
}

export const cancelEdit = () => ({
	type: 'CANCEL_EDIT'
})

export const toggleQuitado = (path, row) => dispatch => {
	api.editData(path, { id: row.id, quitado: !row.quitado })
		.then(data => {
			dispatch({
				type: 'TOGGLE_QUITADO',
				payload: data
			})
			dispatch(loadResumo())
		})
}

export const toggleDelete = row => ({
	type: 'TOGGLE_DELETE',
	payload: row
})

export const checkAllDelete = checked => (dispatch, getState) => {
	dispatch({
		type: 'CHECK_ALL_DELETE',
		payload: checked ? [...getState().transacoes.rows] : []
	})
}

export const saveData = (path, row) => [
	{
		type: 'SAVE_DATA',
		payload: row.id ? api.editData(path, row) : api.postData(path, row) // Edita ou cria um novo
	},
	loadResumo()
]

export const filterChange = filter => dispatch => {
	dispatch({ type: 'FILTER_CHANGE', payload: filter })
	dispatch(loadData())
}

export const changeInitialDate = date => dispatch => {

	const start_date = new Date(date)
	const end_date = new Date(date.getFullYear(), date.getMonth() + 1, 0)

	dispatch(filterChange({
		start_date: start_date.toJSON().slice(0, 10),
		end_date: end_date.toJSON().slice(0, 10)
	}))
}
