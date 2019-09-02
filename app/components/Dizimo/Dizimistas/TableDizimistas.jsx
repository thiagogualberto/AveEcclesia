import React from 'react'
import SearchableTable from '../../../elements/SearchableTable'
import { Field, Action, Actions } from '../../../elements/BootstrapTable'
import '../../../util/formatters'

const filters = [
	{ value: 'nome', label: 'Nome' },
	{ value: 'conjuge', label: 'Cônjuge' }
]

export default props => {

	const { onEdit, onAdd, innerRef, ...rest } = props

	window.format = {
		delete_message: row => `Deseja realmente excluir o dizimista "${row.nome}"?`
	}

	return (
		<SearchableTable
			{...rest}
			ref={innerRef}
			model='dizimista'
			filters={filters}
			placeholder='Pesquisar dizimista'
			onAddData={onAdd}
			url='/dizimista'
		>
			<Field sortable field='codigo' width='110px' align='center'>Código</Field>
      <Field sortable field='nome' width='36%' formatter='membro_inativo'>Nome</Field>
      <Field sortable field='dt_nascimento' width='110px' align='center' formatter='date_format'>Data Nasc</Field>
      <Field sortable field='conjuge'>Cônjuge</Field>
			<Actions title='Ações' width='130px'>
				<Action title='Editar' icon='edit' className='edit' onClick={onEdit} />
				<Action title='Excluir' icon='trash' className='delete' color='#dc3545' />
				<Action title='Desativar' icon='toggle-on' className='status' _if='row.ativo'/>
				<Action title='Ativar' icon='toggle-off' className='status' _if='!row.ativo'/>
			</Actions>
		</SearchableTable>
	)
}
