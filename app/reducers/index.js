import { combineReducers } from 'redux'
import { reducer as formReducer } from 'redux-form'

import transacoesReducer from './transacoesReducer'
import contasReducer from './contasReducer'
import membroReducer from './membroReducer'

export default combineReducers({
	transacoes: transacoesReducer,
	detalhes: membroReducer,
	contas: contasReducer,
	form: formReducer, // Redux Form
})
