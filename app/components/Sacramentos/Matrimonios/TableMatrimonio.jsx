import React, { PureComponent } from 'react'
import SearchableTable from '../../../elements/SearchableTable'
import { Field, Buttons, Button, Divider, Header } from '../../../elements/BootstrapTable'
import format from '../../../util/formatters'

const events = {
	processo: (e, value, row) => window.open(mounturl + '/api/matrimonio/' + row.id + '/processo'),
	certidao: (e, value, row) => window.open(mounturl + '/api/matrimonio/' + row.id + '/certidao'),
	lembranca: (e, value, row) => window.open(mounturl + '/api/matrimonio/' + row.id + '/lembranca'),
}

const filters = [
	{ value: 'noivo_nome', label: 'Noivo' },
	{ value: 'noivo_mae', label: 'Mãe Noivo' },
	{ value: 'noiva_nome', label: 'Noiva' },
	{ value: 'noiva_mae', label: 'Mãe Noiva' },
]

window.noivo_detalhes = (val, row) => format.membro(val, {...row, pessoa_id: row.noivo_id})
window.noiva_detalhes = (val, row) => format.membro(val, {...row, pessoa_id: row.noiva_id})

window.render_casado = (value, row) => {

	// Formata a data
	value = format.date(value)

	// Verifica se está casado
	if (row.casado) {
		return '<div class="status-icon text-center text-light float-right bg-success" title="Matrimônio confirmado"><i class="fa fa-check"></i></div>' + value
	} else {
		return '<div class="status-icon text-center text-light float-right bg-warning" title="Matrimônio pendente"><i class="fa fa-exclamation"></i></div>' + value
	}
}

export default props => {

	const { editMatrimonio, cancelMatrimonio, confirmMatrimonio, notifyMatrimonio, renderToolbar, innerRef, ...rest } = props

	window.format = {
		// cancel_message: row => 'Deseja realmente cancelar esse matrimônio?\n\nNoivo: '+row.noivo_nome+'\nNoiva: '+row.noiva_nome,
		delete_message: row => 'Deseja realmente excluir esse matrimônio?\n\nNoivo: ' + row.noivo_nome + '\nNoiva: ' + row.noiva_nome,
	}

	return (
		<SearchableTable
			{...rest}
			ref={innerRef}
			buttons={buttons}
			filters={filters}
			renderToolbar={renderToolbar}
			sortName='noivo_nome'
			placeholder='Pesquisar matrimônio'
			url='/matrimonio'>

			<Field sortable field='dt_casamento' width='125px' align='center' formatter='render_casado'>Data</Field>
			<Field sortable field='noivo_nome' formatter='noivo_detalhes'>Noivo</Field>
			<Field sortable field='noivo_mae'>Mãe noivo</Field>
			<Field sortable field='noiva_nome' formatter='noiva_detalhes'>Noiva</Field>
			<Field sortable field='noiva_mae'>Mãe noiva</Field>
			<Buttons title='Ações' width='126px'>
				<Header>Opções Matrimônio</Header>
				<Button icon='edit' title='Editar' className='edit' onClick={editMatrimonio} />
				<Button icon='ban' title='Cancelar casamento' className='cancel' _if='row.casado' onClick={cancelMatrimonio} />
				<Button icon='check' title='Confirmar casamento' className='confirm' _if='!row.casado' onClick={confirmMatrimonio} />
				<Button icon='flag-o' title='Notificação de matrimônio' className='notify' _if='row.casado' onClick={notifyMatrimonio} />
				<Button icon='file' title='Certidão' className='certidao' _if='row.casado' onClick={events.certidao} />
				<Button icon='file-o' title='Processo matrimonial' className='processo' _if='!row.casado' onClick={events.processo} />
				<Button icon='file-pdf-o' title='Lembrança' className='lembranca' _if='row.casado' onClick={events.lembranca} />
				<Divider />
				<Button icon='trash' title='Excluir' color='#dc3545' className='delete' />
			</Buttons>
		</SearchableTable>
	)
}
