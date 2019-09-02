import React, { PureComponent } from 'react'
import { Field, SubmissionError, reduxForm } from 'redux-form'

import { FormStateModal } from '../../../elements/FormModal'
import api from '../../../api'
import { Input, AsyncSelect, InputDate } from '../../../lib/ReduxFormFields'

class FormAgente extends PureComponent {

	onSubmit = async data => {

		const resp = await api.sendData('agentes', data, this.props.edit)
		const result = resp.data

		if (!result.success) {
			throw new SubmissionError({ _error: result })
		}

		return result
	}

	render() {
		const { edit, isOpen, error, submitFailed, onCloseForm, handleSubmit, submitting, initialValues } = this.props
		const { nome, comunidade_nome, funcao_nome } = initialValues
		return (
			<FormStateModal
				edit={edit}
				error={submitFailed && error.message || ''}
				saving={submitting}
				isOpen={isOpen}
				onCloseForm={onCloseForm}
				onSubmit={handleSubmit(this.onSubmit)}
				name='agente'
				method='post'
			>
				<Field
					model='membros?ativo=1'
					label='Membro'
					name='pessoa_id'
					defaultText={nome}
					disabled={edit}
					component={AsyncSelect}
					required
				/>
				<Field
					model='funcoes?ativo=1'
					label='Função'
					name='funcao_id'
					defaultText={funcao_nome}
					component={AsyncSelect}
					required
				/>
				<Field
					model='comunidade?ativo=1'
					label='Comunidade'
					name='comunidade_id'
					defaultText={comunidade_nome}
					component={AsyncSelect}
					required
				/>
				<Field type='date' label='Início' name='inicio' component={InputDate} required />
			</FormStateModal>
		)
	}
}

export default reduxForm({
	form: 'form-agente',
	enableReinitialize: true
})(FormAgente)

