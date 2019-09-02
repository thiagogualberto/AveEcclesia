import React, { Component } from 'react'
import { UncontrolledButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap'

import FormConfirmar from './FormConfirmar'
import FormMatrimonio from './FormMatrimonio'
import FormSimplificado from './FormSimplificado'
import FormNotificacao from './FormNotificacao'
import TableMatrimonio from './TableMatrimonio'
import Container from '../../../elements/Container'
import Alert from '../../../util/alert'
import api from '../../../api'
import { withFormEvents } from '../../../util/form-events'

@withFormEvents
class Matrimonios extends Component {

	constructor(props) {
		super(props)
		this.formMat = React.createRef()
		this.formSimp = React.createRef()
		this.state = {}
	}

	addMatrimonio = () => this.formMat.current.addData()
	editMatrimonio = (e, value, row) => this.formMat.current.editData(row)
	addSimplificado = () => this.formSimp.current.addData()

	renderToolbar = () => (
		<UncontrolledButtonDropdown className='ml-3'>
			<DropdownToggle color='primary' caret>Adicionar matrimônio</DropdownToggle>
			<DropdownMenu right>
				<DropdownItem onClick={this.addMatrimonio}>Processo Matrimonial</DropdownItem>
				<DropdownItem onClick={this.addSimplificado}>Matrimônio Simplificado</DropdownItem>
			</DropdownMenu>
		</UncontrolledButtonDropdown>
	)

	cancelMatrimonio = async (e, val, row) => {

		const result = Alert.confirm(`Deseja realmente cancelar esse matrimônio?\n\nNoivo: ${row.noivo_nome}\nNoiva: ${row.noiva_nome}`)

		if (result) {
			await api.editData('/matrimonio', { casado: false }, row.id)
			this.props.refreshTable()
		}
	}

	render = () => {
		const { data, isOpen, tableRef, handleEdit, initial, handleClose, handleSuccess, refreshTable } = this.props
		return (
			<Container title='Matrimônio'>
				<FormMatrimonio
					ref={this.formMat}
					onSubmitSuccess={refreshTable}
				/>
				<FormSimplificado
					ref={this.formSimp}
					onSubmitSuccess={refreshTable}
				/>
				<FormConfirmar
					isOpen={isOpen`confirmar`}
					onCloseForm={handleClose`confirmar`}
					onSubmitSuccess={handleSuccess`confirmar`}
					initialValues={data`confirmar`}
				/>
				<FormNotificacao
					isOpen={isOpen`notificacao`}
					onCloseForm={handleClose`notificacao`}
					initialValues={initial({ quem: 'noivo' })`notificacao`}
				/>
				<TableMatrimonio
					ref={tableRef}
					renderToolbar={this.renderToolbar}
					editMatrimonio={this.editMatrimonio}
					cancelMatrimonio={this.cancelMatrimonio}
					confirmMatrimonio={handleEdit`confirmar`}
					notifyMatrimonio={handleEdit`notificacao`}
				/>
			</Container>
		)
	}
}

export default Matrimonios
