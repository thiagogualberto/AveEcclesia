const initialState = {
	edit: false,
	membro: {
		pessoa_id: '',
		nome: '',
		dt_nascimento: '',
		cpf_cnpj: '',
		rg: '',
		pai: '',
		mae: '',
		falecido: '',
		sexo: '',
		estado_civil: '',
		email: '',
		tel: '',
		cel: '',
		cep: '',
		estado: '',
		cidade: '',
		endereco: '',
		numero: '',
		complemento: '',
		ie_dizimista: 0,
		ie_batismo: 0,
		ie_crisma: 0,
		ie_matrimonio: 0,
	},
	batismo: {
		nome_batismo: '',
		dt_batismo: '',
		padrinho: '',
		madrinha: '',
		celebrante: '',
		paroquia: '',
		livro: '',
		folha: '',
		registro: '',
		obs: '',
	},
	crisma: {
		dt_crisma: '',
		padrinho: '',
		madrinha: '',
		celebrante: '',
		paroquia: '',
		livro: '',
		folha: '',
		registro: '',
	},
	matrimonio: {
		dt_casamento: '',
		noivo_nome: '',
		noiva_nome: '',
		testemunha1: '',
		testemunha2: '',
		celebrante: '',
		local_casamento: '',
		livro: '',
		folha: '',
		registro: '',
	}
}

export default function (state = initialState, action) {
	switch (action.type) {
		case 'LOAD_MEMBRO':
			return { ...state, edit: false, membro: {...action.payload.data} }
		case 'LOAD_DIZIMISTA':
			return { ...state, edit: false, dizimista: {...action.payload.data} }
		case 'LOAD_BATISMO':
			return { ...state, edit: false, batismo: {...action.payload.data} }
		case 'LOAD_CRISMA':
			return { ...state, edit: false, crisma: {...action.payload.data} }
		case 'LOAD_MATRIMONIO':
			return { ...state, edit: false, matrimonio: {...action.payload.data} }
		case 'UPDATE_MEMBRO':
			return { ...state, edit: false, [state.form]: {...action.payload.data.data} }
		case 'UPDATE_FORM':
			return { ...state, ...action.payload.form, membro: { ...state.membro, ...action.payload.membro } }
		case 'SET_EDIT':
			return { ...state, ...action.payload }
		default:
			return state
	}
}