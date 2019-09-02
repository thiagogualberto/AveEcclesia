import React from 'react'
import SearchableTable from '../../../elements/SearchableTable'
import { Field, Action, Actions } from '../../../elements/BootstrapTable'
import '../../../util/formatters'

const filters = [
	{ value: 'nome', label: 'Nome' },
	{ value: 'cpf_cnpj', label: 'CPF' },
]

const TableFuncionarios = props => {

	window.format = {
		delete_message: row => `Deseja realmente excluir o funcionário "${row.pessoa.nome}"?`
	}

	return (
		<SearchableTable
			ref={props.innerRef}
			model='funcionarios'
			filters={filters}
			placeholder='Pesquisar funcionario'
			onAddData={props.onAddFuncionario}
			url='/funcionarios'
		>
			<Field sortable field='pessoa.nome' formatter='inativo_format'>Nome</Field>
			<Field sortable field='funcao'>Função</Field>
			<Field sortable field='dt_admissao' formatter='date_format' width='130px'>Data de admissão</Field>
			<Field sortable field='salario' formatter='money_format' width='140px'>Salário</Field>
			<Actions title='Ações' width='130px'>
				<Action title='Editar' icon='edit' className='edit' onClick={props.onEditFuncionario} />
				<Action title='Excluir' icon='trash' className='delete' color='#dc3545' />
				<Action title='Desativar' icon='toggle-on' className='status' _if='row.ativo'/>
				<Action title='Ativar' icon='toggle-off' className='status' _if='!row.ativo'/>
			</Actions>
		</SearchableTable>
	)
}

export default TableFuncionarios
