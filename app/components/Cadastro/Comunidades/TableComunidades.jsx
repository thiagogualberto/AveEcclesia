import React from 'react'
import SearchableTable from '../../../elements/SearchableTable'
import { Field, Action, Actions } from '../../../elements/BootstrapTable'
import '../../../util/formatters'

const filters = [
	{ value: 'nome', label: 'Nome' },
	{ value: 'cpf_cnpj', label: 'CPF' },
]

const TableComunidades = props => {

	window.format = {
		delete_message: row => `Deseja realmente excluir a comunidade "${row.nome}"?`
	}

	return (
		<SearchableTable
			ref={props.innerRef}
			model='comunidade'
			filters={filters}
			placeholder='Pesquisar comunidade'
			onAddData={props.onAdd}
			url='/comunidade'
		>
			<Field sortable field='nome' formatter='inativo_format'>Nome</Field>
			<Field sortable field='cep'>CEP</Field>
			<Field sortable field='cidade'>Cidade</Field>
			<Field sortable field='bairro'>Bairro</Field>
			<Field sortable field='tel'>Telefone</Field>
			<Actions title='Ações' width='130px'>
				<Action title='Editar' icon='edit' className='edit' onClick={props.onEdit} />
				<Action title='Excluir' icon='trash' className='delete' color='#dc3545' />
				<Action title='Desativar' icon='toggle-on' className='status' _if='row.ativo'/>
				<Action title='Ativar' icon='toggle-off' className='status' _if='!row.ativo'/>
			</Actions>
		</SearchableTable>
	)
}

export default TableComunidades
