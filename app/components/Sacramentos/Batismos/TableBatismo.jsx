import React, { useState } from 'react'
import SearchableTable from '../../../elements/SearchableTable'
import { Field, Buttons, Button, Divider } from '../../../elements/BootstrapTable'
import format from '../../../util/formatters'

const events = {
	certidao: (e, value, row) => window.open(mounturl + '/api/batismo/' + row.id + '/certidao'),
	lembranca: (e, value, row) => window.open(mounturl + '/api/batismo/' + row.id + '/lembranca'),
	outra: (e, value, row) => alert('Não é possível emitir lembrança ou certidão de batismo, pois ' + row.nome_batismo + ' não foi batizado nessa paróquia')
}

const filters = [
	{ value: 'nome_batismo', label: 'Nome' },
	{ value: 'pai', label: 'Pai' },
	{ value: 'mae', label: 'Mãe' },
	{ value: 'padrinho', label: 'Padrinho' },
	{ value: 'madrinha', label: 'Madrinha' },
]

window.nome_batismo = (val, row) => {
	val = row.nome_batismo || row.nome 
	return format.membro(val, { ...row, nome_batismo: val })
}

export default props => {

	const [ filtroPai, setFiltro ] = useState(false)
	const { editBatismo, innerRef, ...rest } = props
	
	const handleFilter = value => {
		setFiltro(value == 'pai' || value == 'mae')
	}

	return (
		<SearchableTable
			{...rest}
			key={filtroPai}
			ref={innerRef}
			filters={filters}
			onChangeFilter={handleFilter}
			sortName='nome_batismo'
			placeholder='Pesquisar batismo'
			url='/batismo'>

			<Field sortable field='dt_batismo' width='110px' align='center' formatter='date_format'>Data</Field>
			<Field sortable field='nome_batismo' formatter='nome_batismo'>Nome</Field>
			<Field sortable field='pai' visible={filtroPai}>Pai</Field>
			<Field sortable field='mae' visible={filtroPai}>Mãe</Field>
			<Field sortable field='padrinho' visible={!filtroPai}>Padrinho</Field>
			<Field sortable field='madrinha' visible={!filtroPai}>Madrinha</Field>
			<Buttons title='Ações' width='126px'>
				<Button icon='edit' title='Editar' className='edit' onClick={editBatismo} />
				<Button icon='file' title='Certidão' className='certidao' _if='!row.outra_paroquia && row.catolico' onClick={events.certidao} />
				<Button icon='file' title='Certidão' className='outra' disabled _if='row.outra_paroquia || !row.catolico' onClick={events.outra} />
				<Button icon='file-pdf-o' title='Lembrança' className='lembranca' _if='!row.outra_paroquia && row.catolico' onClick={events.lembranca} />
				<Button icon='file-pdf-o' title='Lembrança' className='outra' disabled _if='row.outra_paroquia || !row.catolico' onClick={events.outra} />
				<Divider />
				<Button icon='trash' title='Excluir' color='#dc3545' className='delete' />
			</Buttons>
		</SearchableTable>
	)
}
