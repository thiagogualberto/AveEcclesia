import React from 'react'
import SearchableTable from '../../../elements/SearchableTable'
import { Field, Action, Actions } from '../../../elements/BootstrapTable'
import '../../../util/formatters'

const filters = [
	{ value: 'nome', label: 'Nome' },
]

export default props => {

	const { onEditAgente, onAddAgente, innerRef, ...rest } = props

	window.format = {
		delete_message: row => `Deseja realmente excluir o agente "${row.nome}"?`
	}

	return (
		<SearchableTable
			{...rest}
			ref={innerRef}
			model='agentes'
			filters={filters}
			placeholder='Pesquisar agente'
			onAddData={onAddAgente}
			url='/agentes'
		>
			<Field sortable field='inicio' width='110px' align='center' formatter='date_format'>Data</Field>
			<Field sortable field='nome' formatter='membro_inativo'>Nome</Field>
			<Field sortable field='funcao_nome'>Função</Field>
			<Field sortable field='comunidade_nome'>Comunidade</Field>
			<Actions title='Ações' width='130px'>
				<Action title='Editar' icon='edit' className='edit' onClick={onEditAgente} />
				<Action title='Excluir' icon='trash' className='delete' color='#dc3545' />
				<Action title='Desativar' icon='toggle-on' className='status' _if='row.ativo'/>
				<Action title='Ativar' icon='toggle-off' className='status' _if='!row.ativo'/>
			</Actions>
		</SearchableTable>
	)
}
