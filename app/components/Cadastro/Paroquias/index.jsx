import React from 'react'

import Container from '../../../elements/Container'
import TableParoquias from './TableParoquias'
import FormParoquia from './FormParoquia'
import { withFormEvents } from '../../../util/form-events'

const Paroquias = props => (
	<Container title='Paróquias'>
		<TableParoquias
			innerRef={props.tableRef}
			onEdit={props.handleEdit`paroquias`}
			onAdd={props.handleAdd`paroquias`}
		/>
		<FormParoquia
			edit={props.edit}
			isOpen={props.isOpen`paroquias`}
			onCloseForm={props.handleClose`paroquias`}
			onSubmitSuccess={props.handleSuccess`paroquias`}
			initialValues={props.initial`paroquias`}
		/>
	</Container>
)

export default withFormEvents(Paroquias)
