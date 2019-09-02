import React from 'react'

import Container from '../../../elements/Container'
import TableFuncionarios from './TableFuncionarios'
import FormFuncionario from './FormFuncionario'
import { withFormEvents } from '../../../util/form-events'

const Funcionarios = props => (
	<Container title='Funcionários'>
		<TableFuncionarios
			innerRef={props.tableRef}
			onEditFuncionario={props.handleEdit`funcionario`}
			onAddFuncionario={props.handleAdd`funcionario`}
		/>
		<FormFuncionario
			edit={props.edit}
			isOpen={props.isOpen`funcionario`}
			onCloseForm={props.handleClose`funcionario`}
			onSubmitSuccess={props.handleSuccess`funcionario`}
			initialValues={props.data`funcionario`}
		/>
	</Container>
)

export default withFormEvents(Funcionarios)
