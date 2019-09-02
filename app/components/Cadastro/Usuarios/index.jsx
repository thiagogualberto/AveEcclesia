import React from 'react'

import Container from '../../../elements/Container'
import TableUsuarios from './TableUsuarios'
import FormUsuario from './FormUsuario'
import { withFormEvents } from '../../../util/form-events'

const Usuarios = props => (
	<Container title='Usuários'>
		<TableUsuarios
			innerRef={props.tableRef}
			onEdit={props.handleEdit`usuarios`}
			onAdd={props.handleAdd`usuarios`}
		/>
		<FormUsuario
			edit={props.edit}
			isOpen={props.isOpen`usuarios`}
			onCloseForm={props.handleClose`usuarios`}
			onSubmitSuccess={props.handleSuccess`usuarios`}
			initialValues={props.initial`usuarios`}
		/>
	</Container>
)

export default withFormEvents(Usuarios)
