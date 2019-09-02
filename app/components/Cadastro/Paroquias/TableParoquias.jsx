import React from 'react'
import SearchableTable from '../../../elements/SearchableTable'
import { Field, Action, Actions } from '../../../elements/BootstrapTable'

const filters = [
	{ value: 'nome', label: 'Nome' },
	{ value: 'cidade', label: 'Cidade' },
]

const TableParoquias = props => (
	<SearchableTable
		ref={props.innerRef}
		actions={actions}
		model='paroquia'
		filters={filters}
		placeholder='Pesquisar paroquia'
		onAddData={props.onAdd}
		url='/paroquia'
	>
		<Field sortable field='nome'>Nome</Field>
		<Field sortable field='cidade'>Cidade</Field>
		<Field sortable field='diocese_nome'>Diocese</Field>
		<Actions title='Ações' width='130px'>
			<Action title='Editar' icon='edit' className='edit' onClick={props.onEdit} />
			<Action title='Excluir' icon='trash' className='delete' color='#dc3545' />
			<Action title='Desativar' icon='toggle-on' className='status' _if='row.ativo'/>
			<Action title='Ativar' icon='toggle-off' className='status' _if='!row.ativo'/>
		</Actions>
	</SearchableTable>
)

export default TableParoquias
