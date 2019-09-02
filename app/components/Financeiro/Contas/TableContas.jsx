import React from 'react'
import SearchableTable from '../../../elements/SearchableTable'
import { Field, Action, ActionToggle, Actions } from '../../../elements/BootstrapTable'
import '../../../util/formatters'

const filters = [
	{ value: 'nome', label: 'Nome' },
	{ value: 'banco', label: 'Banco' },
]

window.tipos_format = (value, row) => {
	switch (row.tipo) {
		case 'CC': return 'Conta Corrente'
		case 'CP': return 'Conta Poupança'
		case 'CE': return 'Caixa Escritório'
	}
}

export default props => {

	const { onEdit, onAdd, innerRef, ...rest } = props

	window.format = {
		delete_message: row => `Deseja realmente excluir a conta "${row.nome}"?`
	}

	return (
		<SearchableTable
			{...rest}
			ref={innerRef}
			model='contas'
			filters={filters}
			onAddData={onAdd}
			placeholder='Pesquisar conta'
			url='/contas'>

			<Field sortable field='nome' formatter='inativo_format'>Nome</Field>
			<Field sortable field='saldo' formatter='money_format'>Saldo</Field>
			<Field field='tipo' formatter='tipos_format'>Tipo</Field>
			<Field sortable field='banco'>Banco</Field>
			<Field field='agencia'>Agência</Field>
			<Field field='conta'>Conta</Field>
			<Actions title='Ações' width='130px' _if='row.tipo !== "CE"'>
				<Action title='Editar' icon='edit' className='edit' onClick={onEdit}  _if='row.tipo !== "CE"' />
				<Action title='Excluir' icon='trash' className='delete' color='#dc3545' _if='row.tipo !== "CE"' />
				<ActionToggle  className='status' _if='row.tipo !== "CE"' />
			</Actions>
		</SearchableTable>
	)
}
