import React, { PureComponent } from 'react'
import { Field, SubmissionError, reduxForm } from 'redux-form'
import { Row } from 'reactstrap'

import { FormStateModal } from '../../../elements/FormModal'
import { Input, InputMask, InputDate } from '../../../lib/ReduxFormFields'
import api from '../../../api'

@reduxForm({ form: 'form-confirmar', enableReinitialize: true })
class FormConfirmar extends PureComponent {

	constructor(props) {
		super(props)
		this.form = React.createRef()
	}

	onSubmit = async data => {

		const resp = await api.editData('/matrimonio', { ...data, casado: true })
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
				row={false}
				title='Confirmar matrimônio'
				method='post'>
				<Row form>
					<Field label='Local' name='local_casamento' component={Input} required />
					<Field md={6} label='Data' name='dt_casamento' component={InputDate} required />
					<Field md={6} label='Hora' name='hr_casamento' mask='99:99' component={InputMask} required />
					<Field label='Celebrante' name='celebrante' component={Input} required />
					<Field md={4} label='Livro' name='livro' component={Input} required />
					<Field md={4} label='Folha' name='folha' component={Input} required />
					<Field md={4} label='Registro' name='registro' component={Input} required />
					<Field label='Testemunha 1' name='testemunha1' component={Input} required />
					<Field label='Testemunha 2' name='testemunha2' component={Input} required />
				</Row>
			</FormStateModal>
		)
	}
}

export default FormConfirmar
