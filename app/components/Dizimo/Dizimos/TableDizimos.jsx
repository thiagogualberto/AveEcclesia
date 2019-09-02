import React from 'react'
import SearchableTable from '../../../elements/SearchableTable'
import { Field, Action, Actions } from '../../../elements/BootstrapTable'
import format from '../../../util/formatters'

const filters = [
	{ value: 'nome', label: 'Dizimista' }
]

const TableDizimos = props => {

	window.format = {
		delete_message: row => 'Deseja realmente excluir esse dízimo?\n\nDizimista: ' + row.pessoa_nome + '\nData: ' + format.date(row.dt_pagamento)
	}

	return (
		<SearchableTable ref={props.innerRef} filters={filters} placeholder='Pesquisar dizimista' sortOrder='desc' url='/dizimo'>
			<Field sortable field='pessoa_nome'>Dizimista</Field>
			<Field sortable field='pago' formatter='money_format'>Valor</Field>
			<Field sortable field='dt_vencimento' formatter='referencia_format' width='76px' align='center' className='text-muted'>Ref.</Field>
			<Field sortable field='dt_pagamento' formatter='date_format' width='110px' align='center' className='text-muted'>Data</Field>
			<Actions title='Ações' width='90px'>
				<Action title='Editar' icon='edit' className='edit' onClick={props.onEdit} />
				<Action title='Excluir' icon='trash' className='delete' color='#dc3545' />
			</Actions>
		</SearchableTable>
	)
}

export default TableDizimos
