import React, { PureComponent } from 'react'
import { Field, SubmissionError, reduxForm } from 'redux-form'
import { Row, Col } from 'reactstrap'

import { FormStateModal } from '../../../elements/FormModal'
import api from '../../../api'
import {
	Input,
	SelectEstadoCivil,
	SelectEstados,
	InputMask,
	InputDate,
	InputSexo,
} from '../../../lib/ReduxFormFields'
import initCepWebserver from '../../../util/cep-webserver'

class FormMembro extends PureComponent {

	constructor(props) {
		super(props)
		this.form = React.createRef()
		this.cepWebserver = initCepWebserver(props)
	}

	onSubmit = async data => {

		const resp = await api.sendData('membros', data, this.props.edit)
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
				size='lg'
				name='membro'
				method='post'>
				<Col>
					<Row form>
						<Field label='Nome' name='nome' component={Input} required />
						<Field label='Nome do Pai' name='pai' component={Input} />
						<Field label='Nome da Mãe' name='mae' component={Input} />
						<Field md={6} label='Data de nascimento' name='dt_nascimento' component={InputDate} required />
						<Field md={6} label='Estado civil' name='estado_civil' component={SelectEstadoCivil} required />
						<Field label='Sexo' name='sexo' component={InputSexo} required />
					</Row>
				</Col>
				<Col>
					<Row form>
						<Field md={6} label='CEP' name='cep' mask='99999-999' onChange={this.cepWebserver} component={InputMask} />
						<Field md={6} label='Estado' name='uf' component={SelectEstados} />
						<Field label='Cidade' name='cidade' component={Input} />
						<Field label='Bairro' name='bairro' component={Input} />
						<Field md={8} label='Endereço' name='endereco' component={Input} />
						<Field md={4} label='Número' name='numero' component={Input} />
						<Field label='Complemento' name='complemento' component={Input} />
					</Row>
				</Col>
			</FormStateModal>
		)
	}
}

export default reduxForm({
	form: 'form-membro',
	enableReinitialize: true
})(FormMembro)
