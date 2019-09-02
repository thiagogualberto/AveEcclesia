const initialState = {
	resumo: {
		total_previsto: '',
		total_receita: '',
		total_despesa: '',
		receita_previsto: '',
		despesa_previsto: ''
	}
}

export default function (state = initialState, action) {
	switch (action.type) {
		case 'LOAD_RESUMO':
			return { ...state, resumo: { ...action.payload.data } }
		default:
			return state
	}
}