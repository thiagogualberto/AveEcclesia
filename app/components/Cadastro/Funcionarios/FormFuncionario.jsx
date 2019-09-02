import React, { PureComponent, Fragment } from 'react'
import { Field, FormSection, SubmissionError, reduxForm } from 'redux-form'
import { Row, Col } from 'reactstrap'

import { FormStateModal } from '../../../elements/FormModal'
import api from '../../../api'
import {
	Input,
	SelectEstados,
	InputMask,
	InputDate,
	InputCurrency,
	InputTelefone,
} from '../../../lib/ReduxFormFields'
import initCepWebserver from '../../../util/cep-webserver'

@reduxForm({ form: 'form-funcionario', enableReinitialize: true })
class FormFuncionario extends PureComponent {

	constructor(props) {
		super(props)
		this.form = React.createRef()
		this.cepWebserver = initCepWebserver(props)
	}

	onSubmit = async data => {

		const resp = await api.sendData('funcionarios', data, this.props.edit)
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
				title='funcionário'
				method='post'>
				<Col>
					<Row form>
						<FormSection name='pessoa' component={Fragment}>
							<Field label='Nome' name='nome' component={Input} required />
							<Field md={6} label='CPF' name='cpf_cnpj' mask='999.999.999-99' component={InputMask} required />
						</FormSection>
						<Field md={6} label='Telefone' name='tel' component={InputTelefone} required />
						<Field label='Nome da função' name='funcao' component={Input} required />
						<Field md={6} label='Salário' name='salario' component={InputCurrency} required />
						<Field md={6} label='Data de admissão' name='dt_admissao' component={InputDate} required />
						<Field label='E-mail' name='email' component={Input} />
					</Row>
				</Col>
				<Col>
					<Row form>
						<Field md={6} label='CEP' name='cep' mask='99999-999' onChange={this.cepWebserver} component={InputMask} required />
						<Field md={6} label='Estado' name='uf' component={SelectEstados} required />
						<Field label='Cidade' name='cidade' component={Input} required />
						<Field label='Bairro' name='bairro' component={Input} required/>
						<Field md={8} label='Endereço' name='endereco' component={Input} required/>
						<Field md={4} label='Número' name='numero' component={Input} required />
						<Field label='Complemento' name='complemento' component={Input} />
					</Row>
				</Col>
			</FormStateModal>
		)
	}
}

export default (FormFuncionario)
