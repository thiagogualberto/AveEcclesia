import React from 'react'
import SearchableTable, { Field } from '../../../elements/SearchableTable'
import { Action, Actions } from '../../../elements/BootstrapTable'
import '../../../util/formatters'

const filters = [
	{ value: 'nome', label: 'Nome' },
	{ value: 'pai', label: 'Pai' },
	{ value: 'mae', label: 'Mãe' },
]

const TableMembros = props => {
	
	window.format = {
		delete_message: row => `Deseja realmente excluir o membro "${row.nome}"?`
	}

	return (
		<SearchableTable
			ref={props.innerRef}
			actions={actions}
			model='membros'
			filters={filters}
			placeholder='Pesquisar membro'
			onAddData={props.onAddMembro}
			url='/membros'
		>
			<Field sortable field='nome' formatter='membro_inativo'>Nome</Field>
			<Field sortable field='pai'>Nome do Pai</Field>
			<Field sortable field='mae'>Nome da Mãe</Field>
			<Actions title='Ações' width='130px'>
				<Action title='Editar' icon='edit' className='edit' onClick={props.onEditMembro} />
				<Action title='Excluir' icon='trash' className='delete' color='#dc3545' />
				<Action title='Desativar' icon='toggle-on' field='pessoa_id' className='status' _if='row.ativo'/>
				<Action title='Ativar' icon='toggle-off' field='pessoa_id' className='status' _if='!row.ativo'/>
			</Actions>
		</SearchableTable>
	)
}

export default TableMembros
