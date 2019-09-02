import api from '../api'

export const loadResumo = () => ({
	type: 'LOAD_RESUMO',
	payload: api.loadData('/contas/resumo')
})