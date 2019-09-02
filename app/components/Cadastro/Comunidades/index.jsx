import React from 'react'

import Container from '../../../elements/Container'
import TableComunidades from './TableComunidades'
import FormComunidade from './FormComunidade'
import { withFormEvents } from '../../../util/form-events'

const Comunidades = props => (
	<Container title='Comunidades'>
		<TableComunidades
			innerRef={props.tableRef}
			onEdit={props.handleEdit`comunidade`}
			onAdd={props.handleAdd`comunidade`}
		/>
		<FormComunidade
			edit={props.edit}
			isOpen={props.isOpen`comunidade`}
			onCloseForm={props.handleClose`comunidade`}
			onSubmitSuccess={props.handleSuccess`comunidade`}
			initialValues={props.data`comunidade`}
		/>
	</Container>
)

export default withFormEvents(Comunidades)
