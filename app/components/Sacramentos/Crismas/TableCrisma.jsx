import React, { useState } from 'react'
import SearchableTable from '../../../elements/SearchableTable'
import { Field, Buttons, Button, Divider } from '../../../elements/BootstrapTable'
import '../../../util/formatters'

const events = {
	certidao: (e, value, row) => window.open(mounturl + '/api/crisma/' + row.id + '/certidao'),
	lembranca: (e, value, row) => window.open(mounturl + '/api/crisma/' + row.id + '/lembranca'),
}

const filters = [
	{ value: 'nome', label: 'Nome' },
	{ value: 'pai', label: 'Pai' },
	{ value: 'mae', label: 'Mãe' },
	{ value: 'padrinho', label: 'Padrinho' },
	{ value: 'madrinha', label: 'Madrinha' },
]

export default props => {

	const [ filtroPai, setFiltro ] = useState(false)
	const { editCrisma, addCrisma, innerRef, ...rest } = props
	
	const handleFilter = value => {
		setFiltro(value == 'pai' || value == 'mae')
	}

	return (
		<SearchableTable
			{...rest}
			ref={innerRef}
			key={filtroPai}
			filters={filters}
			onAddData={addCrisma}
			onChangeFilter={handleFilter}
			placeholder='Pesquisar crisma'
			url='/crisma'>

			<Field sortable field='dt_crisma' width='110px' align='center' formatter='date_format'>Data</Field>
			<Field sortable field='nome' formatter='membro_format'>Nome</Field>
			<Field sortable field='pai' visible={filtroPai}>Pai</Field>
			<Field sortable field='mae' visible={filtroPai}>Mãe</Field>
			<Field sortable field='padrinho' visible={!filtroPai}>Padrinho</Field>
			<Field sortable field='madrinha' visible={!filtroPai}>Madrinha</Field>
			<Buttons title='Ações' width='126px'>
				<Button icon='edit' title='Editar' className='edit' onClick={editCrisma} />
				<Button icon='file' title='Certidão' className='certidao' onClick={events.certidao} />
				<Button icon='file-pdf-o' title='Lembrança' className='lembranca' onClick={events.lembranca} />
				<Divider />
				<Button icon='trash' title='Excluir' color='#dc3545' className='delete' />
			</Buttons>
		</SearchableTable>
	)
}
