import React, { PureComponent } from 'react'
import { Field, reduxForm } from 'redux-form'
import { Row, Col } from 'reactstrap'

import { FormStateModal } from '../../../elements/FormModal'
import { Input, AsyncSelect } from '../../../lib/ReduxFormFields'
import api from '../../../api'

class FormUsuario extends PureComponent {

	constructor(props) {
		super(props)
		this.form = React.createRef()
	}

	onSubmit = async data => {

		const resp = await api.sendData('users', data, this.props.edit)
		const result = resp.data

		if (!result.success) {
			throw new SubmissionError({ _error: result })
		}

		return result
	}

	render() {
		const { edit, isOpen, error, initialValues, submitFailed, submitting, onCloseForm, handleSubmit } = this.props
		const { paroquia_nome } = initialValues
		return (
			<FormStateModal
				edit={edit}
				error={submitFailed && error.message || ''}
				saving={submitting}
				isOpen={isOpen}
				onCloseForm={onCloseForm}
				onSubmit={handleSubmit(this.onSubmit)}
				size='lg'
				title='usuário'
				name='usuario'
				method='post'>
				<Col>
					<Row form>
						<Field label='Nome' name='nome' component={Input} required />
						<Field label='E-mail' name='email' component={Input} required />
						<Field md={6} label='Login' name='usuario' component={Input} required />
						<Field md={6} label='Senha' name='senha' type='password' component={Input} />
						<Field label='Local' name='paroquia_id' model='paroquia' defaultText={paroquia_nome || ''} defaultOptions component={AsyncSelect} required />
						<Field label='Perfil' name='perfil' model='perfil' defaultOptions component={AsyncSelect} required />
					</Row>
				</Col>
				<Col>
					<Row form></Row>
				</Col>
			</FormStateModal>
		)
	}
}

export default reduxForm({
	form: 'form-usuario',
	enableReinitialize: true
})(FormUsuario)
