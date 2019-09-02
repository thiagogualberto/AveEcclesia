import date from '../util/date'

// Formata para moeda BRL
window.money_format = value => {
	return 'R$ ' + (value || 0).toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
}

// Formata a data de referência do dízimo
window.referencia_format = value => {
	return ('' + value).replace(/(\d{4})-(\d{2}).*/, '$2<small>/$1</small>')
}

// Formata a coluna como texto taxado se estiver inativo
window.inativo_format = (value, row) => {
	return row.ativo == 1 ? value : '<del>' + value + '</del>'
}

window.membro_format = (val, row) => {
	const path = '/cadastro/membros/' + row.pessoa_id
	return `<a class="react-link" href="${mounturl+path}" data-path="${path}">${val}</a>`
}

window.membro_inativo = (val, row) => {
	return membro_format(inativo_format(val, row), row)
}

// Formata datas em geral
window.date_format = date.unserialize

export default {
	date: date_format,
	money: money_format,
	inativo: inativo_format,
	membro: membro_format,
	membro_inativo: membro_inativo,
	referencia: referencia_format,
}