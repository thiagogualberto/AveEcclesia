import React, { useState } from 'react'
import { Field, reduxForm, SubmissionError } from 'redux-form'
import { Row, Card, CardTitle, Alert } from 'reactstrap'

import api from '../../api'
import ButtonLoad from '../../elements/ButtonLoad'
import { Input } from '../../lib/ReduxFormFields'

const FormSenha = props => {
	
	const { submitFailed, submitSucceeded, reset, submitting, pristine, handleSubmit } = props
	const [ message, setMessage ] = useState()

	// Função que troca a senha na api
	async function alterarSenha (items) {

		// Handle error
		if (items.pass1 !== items.pass2) {
			setMessage('As senhas precisam ser iguais')
			throw new SubmissionError()
		}

		const result = await api.editData('/users', { id: window.user.id, raw_password: items.pass1 })
		const data = result.data

		// Salva a mensagem, e reseta os campos
		setMessage(data.message)
		reset()
	}

	return (
		<Card body>
			<CardTitle tag='h4'>Atualizar senha</CardTitle>
			<form className='mt-3' onSubmit={handleSubmit(alterarSenha)}>
				<Row>
					<Field label='Nova senha' name='pass1' type='password' required component={Input} />
					<Field label='Repetir senha' name='pass2' type='password' required component={Input} />
				</Row>
				{ submitFailed && <Alert color='danger'>{message}</Alert> }
				{ submitSucceeded && <Alert color='success'>{message}</Alert> }
				<ButtonLoad loading={submitting} disabled={pristine} text='Salvar' loadingText='Salvando...' />
			</form>
		</Card>
	)
}

export default reduxForm({
	form: 'form-senha',
	enableReinitialize: true
})(FormSenha)