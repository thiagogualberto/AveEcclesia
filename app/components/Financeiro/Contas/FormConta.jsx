import React, { PureComponent } from 'react'
import { Field, SubmissionError, reduxForm } from 'redux-form'
import { Row } from 'reactstrap'

import { FormStateModal } from '../../../elements/FormModal'
import api from '../../../api'
import {
	Input,
	Select,
	InputMask,
	InputTelefone,
} from '../../../lib/ReduxFormFields'
import initCepWebserver from '../../../util/cep-webserver'

const options = [
	{ value: 'CC', label: 'Conta Corrente' },
	{ value: 'CP', label: 'Conta Poupança' },
]

const FormConta = props => {
	
	const { edit, isOpen, error, submitFailed, onCloseForm, handleSubmit, submitting } = props

	async function onSubmit (data)
	{
		const resp = await api.sendData('contas', data, props.edit)
		const result = resp.data

		if (!result.success) {
			throw new SubmissionError({ _error: result })
		}

		return result
	}

	return (
		<FormStateModal
			edit={edit}
			error={submitFailed && error.message || ''}
			saving={submitting}
			isOpen={isOpen}
			onCloseForm={onCloseForm}
			onSubmit={handleSubmit(onSubmit)}
			title='Contas'
			row={false}
			method='post'>
			<Row form>
				<Field label='Nome' name='nome' component={Input} required />
				<Field md={6} label='Tipo' name='tipo' options={options} component={Select} required />
				<Field md={6} label='Banco' name='banco' component={Input} required />
				<Field md={6} label='Agência' name='agencia' component={Input} required />
				<Field md={6} label='Nº da conta' name='conta' component={Input} required />
			</Row>
		</FormStateModal>
	)
}

export default reduxForm({
	form: 'form-conta',
	enableReinitialize: true
})(FormConta)
