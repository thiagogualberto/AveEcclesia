import React from 'react'
import SearchableTable from '../../../elements/SearchableTable'
import { Field, Action, Actions } from '../../../elements/BootstrapTable'

const filters = [
	{ value: 'nome', label: 'Nome' },
	{ value: 'usuario', label: 'Login' },
]

const TableUsuarios = props => (
	<SearchableTable
		ref={props.innerRef}
		actions={actions}
		model='usuario'
		filters={filters}
		placeholder='Pesquisar usuário'
		onAddData={props.onAdd}
		url='/users'
	>
		<Field sortable field='usuario'>Login</Field>
		<Field sortable field='nome'>Nome</Field>
		<Field sortable field='paroquia_nome'>Paróquia</Field>
		<Actions title='Ações' width='130px'>
			<Action title='Editar' icon='edit' className='edit' onClick={props.onEdit} />
			<Action title='Excluir' icon='trash' className='delete' color='#dc3545' />
			<Action title='Desativar' icon='toggle-on' className='status' _if='row.ativo'/>
			<Action title='Ativar' icon='toggle-off' className='status' _if='!row.ativo'/>
		</Actions>
	</SearchableTable>
)

export default TableUsuarios
