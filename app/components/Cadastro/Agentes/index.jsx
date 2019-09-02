import React, { Component } from 'react'

import FormAgente from './FormAgente'
import TableAgentes from './TableAgentes'
import Container from '../../../elements/Container'
import { withFormEvents } from '../../../util/form-events'

const Agentes = props => (
	<Container title='Agentes'>
		<TableAgentes
			innerRef={props.tableRef}
			onEditAgente={props.handleEdit`agente`}
			onAddAgente={props.handleAdd`agente`}
		/>
		<FormAgente
			edit={props.edit}
			isOpen={props.isOpen`agente`}
			onCloseForm={props.handleClose`agente`}
			onSubmitSuccess={props.handleSuccess`agente`}
			initialValues={props.data`agente`}
		/>
	</Container>
)

export default withFormEvents(Agentes)
