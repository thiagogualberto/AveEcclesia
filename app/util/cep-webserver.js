import api from '../api'

export default props => {

	const setField = (name, value) => {
		if (value !== '') {
			props.autofill(name, value)
		}
	}

	const cepWebserver = (e, val, prev) => {
		const cep = val.replace(/\D/g, '')
		if (val !== prev && cep.length === 8) {
			api.loadData(`https://viacep.com.br/ws/${cep}/json`).then(({ data }) => {
				setField('uf', data.uf)
				setField('cidade', data.localidade)
				setField('bairro', data.bairro)
				setField('endereco', data.logradouro)
			})
		}
	}

	return cepWebserver
}
