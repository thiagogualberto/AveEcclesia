import React, { PureComponent } from 'react'
import { Field, SubmissionError, reduxForm } from 'redux-form'
import { Row, Col } from 'reactstrap'

import { FormStateModal } from '../../../elements/FormModal'
import api from '../../../api'
import {
	Input,
	AsyncSelect,
	SelectEstados,
	InputFile,
	InputMask,
	InputDate,
} from '../../../lib/ReduxFormFields'

class FormParoquia extends PureComponent {

	constructor(props) {
		super(props)
		this.form = React.createRef()
	}

	onSubmit = async data => {

		const resp = await api.sendData('paroquia', data, this.props.edit)
		const result = resp.data

		if (!result.success) {
			throw new SubmissionError({ _error: result })
		}

		return result
	}

	cepWebserver = (e, val, prev) => {
		const cep = val.replace(/\D/g, '')
		if (val !== prev && cep.length === 8)
		{
			api.loadData(`https://viacep.com.br/ws/${cep}/json`).then(({data}) => {
				this.setField('uf', data.uf)
				this.setField('cidade', data.localidade)
				this.setField('bairro', data.bairro)
				this.setField('endereco', data.logradouro)
			})
		}
	}

	setField = (name, value) => {
		if (value !== '') {
			this.props.autofill(name, value)
		}
	}

	render() {
		const { edit, isOpen, error, submitFailed, initialValues, onCloseForm, handleSubmit, submitting } = this.props
		const { diocese_nome } = initialValues
		return (
			<FormStateModal
				edit={edit}
				error={submitFailed && error.message || ''}
				saving={submitting}
				isOpen={isOpen}
				onCloseForm={onCloseForm}
				onSubmit={handleSubmit(this.onSubmit)}
				size='lg'
				title='paróquia'
				name='paroquia'
				method='post'>
				<Col>
					<Row form>
						<Field label='Diocese' name='diocese_id' model='diocese' defaultText={diocese_nome} component={AsyncSelect} required />
						<Field label='Nome' name='nome' component={Input} required />
						<Field md={6} label='CNPJ' name='cnpj' mask='99.999.999/9999-99' component={InputMask} required />
						<Field md={6} label='Data de fundação' type='date' name='dt_fundacao' component={InputDate} />
						<Field label='Responsável' name='responsavel' component={Input} required />
						<Field label='Logomarca' name='logo' text='Selecione...' component={InputFile} />
					</Row>
				</Col>
				<Col>
					<Row form>
						<Field md={6} label='Telefone 1' name='tel1' mask='(99) 9999-9999' component={InputMask} required />
						<Field md={6} label='Telefone 2' name='tel2' mask='(99) 9999-9999' component={InputMask} />
						{/* <Field md={4} label='Telefone 3' name='tel3' mask='(99) 9999-9999' component={Campo} /> */}
						<Field md={6} label='CEP' name='cep' mask='99999-999' onChange={this.cepWebserver} component={InputMask} required />
						<Field md={6} label='Estado' name='uf' component={SelectEstados} required />
						<Field label='Cidade' name='cidade' component={Input} required />
						<Field label='Bairro' name='bairro' component={Input} required />
						<Field md={8} label='Endereço' name='endereco' component={Input} required />
						<Field md={4} label='Número' name='numero' component={Input} required />
					</Row>
				</Col>
				{/* <Field label='' name='' component={Campo} /> */}
			</FormStateModal>
		)
	}
}

export default reduxForm({
	form: 'form-paroquia',
	enableReinitialize: true
})(FormParoquia)
