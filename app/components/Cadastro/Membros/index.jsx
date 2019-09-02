import React from 'react'

import Container from '../../../elements/Container'
import TableMembros from './TableMembros'
import FormMembro from './FormMembro'
import { withFormEvents } from '../../../util/form-events'

const Membros = props => (
	<Container title='Membros'>
		<TableMembros
			innerRef={props.tableRef}
			onEditMembro={props.handleEdit`membro`}
			onAddMembro={props.handleAdd`membro`}
		/>
		<FormMembro
			edit={props.edit}
			isOpen={props.isOpen`membro`}
			onCloseForm={props.handleClose`membro`}
			onSubmitSuccess={props.handleSuccess`membro`}
			initialValues={props.data`membro`}
		/>
	</Container>
)

export default withFormEvents(Membros)
