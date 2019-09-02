import React, { PureComponent } from 'react'
import { Field, SubmissionError, reduxForm } from 'redux-form'
import { Row } from 'reactstrap'

import { FormStateModal } from '../../../elements/FormModal'
import api from '../../../api'
import {
	Input,
	SelectEstados,
	InputMask,
	InputTelefone,
} from '../../../lib/ReduxFormFields'
import initCepWebserver from '../../../util/cep-webserver'

@reduxForm({ form: 'form-comunidade', enableReinitialize: true })
class FormComunidade extends PureComponent {

	constructor(props) {
		super(props)
		this.form = React.createRef()
		this.cepWebserver = initCepWebserver(props)
	}

	onSubmit = async data => {

		const resp = await api.sendData('comunidade', data, this.props.edit)
		const result = resp.data

		if (!result.success) {
			throw new SubmissionError({ _error: result })
		}

		return result
	}

	render() {
		const { edit, isOpen, error, submitFailed, onCloseForm, handleSubmit, submitting } = this.props
		return (
			<FormStateModal
				edit={edit}
				error={submitFailed && error.message || ''}
				saving={submitting}
				isOpen={isOpen}
				onCloseForm={onCloseForm}
				onSubmit={handleSubmit(this.onSubmit)}
				title='Comunidades'
				size='md'
				row={false}
				method='post'>
				<Row form>
					<Field label='Nome' name='nome' component={Input} required />
					<Field label='E-mail' name='email' component={Input} required />
					<Field md={4} label='Telefone' name='tel' component={InputTelefone} required />
					<Field md={4} label='CEP' name='cep' mask='99999-999' onChange={this.cepWebserver} component={InputMask} required />
					<Field md={4} label='Estado' name='uf' component={SelectEstados} required />
					<Field label='Cidade' name='cidade' component={Input} required />
					<Field label='Bairro' name='bairro' component={Input} required/>
					<Field md={8} label='Endereço' name='endereco' component={Input} required/>
					<Field md={4} label='Número' name='numero' component={Input} required />
				</Row>
			</FormStateModal>
		)
	}
}

export default FormComunidade
