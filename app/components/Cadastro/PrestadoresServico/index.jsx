import React from 'react'

import Container from '../../../elements/Container'
import TablePrestadoresServico from './TablePrestadoresServico'
import FormPrestadoresServico from './FormPrestadoresServico'
import { withFormEvents } from '../../../util/form-events'

const defaultValues = {
	pessoa: { tipo: 'J' }
}

const PrestadoresServicos = props => (
	<Container title='Prestadores de Serviço'>
		<TablePrestadoresServico
			innerRef={props.tableRef}
			onEdit={props.handleEdit`prestador`}
			onAdd={props.handleAdd`prestador`}
		/>
		<FormPrestadoresServico
			edit={props.edit}
			isOpen={props.isOpen`prestador`}
			onCloseForm={props.handleClose`prestador`}
			onSubmitSuccess={props.handleSuccess`prestador`}
			initialValues={props.initial(defaultValues)`prestador`}
		/>
	</Container>
)

export default withFormEvents(PrestadoresServicos)
