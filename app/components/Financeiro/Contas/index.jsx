import React from 'react'

import Container from '../../../elements/Container'
import TableContas from './TableContas'
import FormConta from './FormConta'
import { withFormEvents } from '../../../util/form-events'

const Contas = props => (
	<Container title='Contas'>
		<TableContas
			innerRef={props.tableRef}
			onEdit={props.handleEdit`conta`}
			onAdd={props.handleAdd`conta`}
		/>
		<FormConta
			edit={props.edit}
			isOpen={props.isOpen`conta`}
			onCloseForm={props.handleClose`conta`}
			onSubmitSuccess={props.handleSuccess`conta`}
			initialValues={props.data`conta`}
		/>
	</Container>
)

export default withFormEvents(Contas)
