import React from 'react'
import SearchableTable from '../../../elements/SearchableTable'
import { Field, Action, Actions } from '../../../elements/BootstrapTable'
import '../../../util/formatters'

const filters = [
	{ value: 'nome', label: 'Nome' },
	{ value: 'cpf_cnpj', label: 'CPF' },
]

const TablePrestadoresServico = props => {

	window.format = {
		delete_message: row => `Deseja realmente excluir o funcionário "${row.pessoa.nome}"?`
	}

	return (
		<SearchableTable
			ref={props.innerRef}
			model='prestadores'
			filters={filters}
			placeholder='Pesquisar prestador de serviço'
			onAddData={props.onAdd}
			url='/prestadores'
		>
			<Field sortable field='pessoa.nome' formatter='inativo_format'>Nome</Field>
			<Field sortable field='pessoa.cpf_cnpj'>CPF/CNPJ</Field>
			<Field sortable field='email'>E-mail</Field>
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

export default TablePrestadoresServico
