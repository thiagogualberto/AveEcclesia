import React, { useState } from 'react'
import { Field, reduxForm, FormSection } from 'redux-form'
import { Row, CardTitle, Alert } from 'reactstrap'

import api from '../../api'
import ButtonLoad from '../../elements/ButtonLoad'
import { Input } from '../../lib/ReduxFormFields'

const FormUsuario = props => {
	
	const { submitFailed, submitSucceeded, reset, submitting, pristine, handleSubmit } = props
	const [ message, setMessage ] = useState()

	// Função que troca a senha na api
	async function atualizarUsuario (items) {
		try {

			const result = await api.editData('/users', items)
			const data = result.data
			
			// Salva a mensagem, e reseta os campos
			setMessage(data.message)
			reset()
			
			// Reseta o usuário
			window.user = items
			return items

		} catch (e) {
			setMessage(e)
		}
	}

	return (
		<form className='mt-3' onSubmit={handleSubmit(atualizarUsuario)}>
			<Row>
				<Field md={6} label='Nome do Usuário' name='nome' required component={Input} />
				<Field md={6} label='E-mail' name='email' required component={Input} />
			</Row>
			<hr/>
			<CardTitle tag='h4' className='mt-4 pb-3'>Informações da Paróquia</CardTitle>
			<FormSection name='paroquia' component={Row}>
				<Field md={4} label='Telefone 1' name='tel1' required component={Input} />
				<Field md={4} label='Telefone 2' name='tel2' required component={Input} />
				<Field md={4} label='Telefone 3' name='tel3' required component={Input} />
				<Field md={6} label='Nome visível' name='nome' required component={Input} />
				<Field md={6} label='Responsável' name='responsavel' required component={Input} />
			</FormSection>
			{ submitFailed && <Alert color='danger'>{message}</Alert> }
			{ submitSucceeded && <Alert color='success'>{message}</Alert> }
			<ButtonLoad loading={submitting} disabled={pristine} text='Salvar' loadingText='Salvando...' />
		</form>
	)
}

export default reduxForm({
	form: 'form-usuario',
	enableReinitialize: true
})(FormUsuario)