import React, { PureComponent } from 'react'
import { Field, reduxForm } from 'redux-form'
import querystring from 'querystring'

import { FormStateModal } from '../../../elements/FormModal'
import { Input, InputBoolean } from '../../../lib/ReduxFormFields'

const options = [
	{ label: 'Noivo', value: 'noivo' },
	{ label: 'Noiva', value: 'noiva' },
]

@reduxForm({ form: 'form-notificacao', enableReinitialize: true })
class FormNotificacao extends PureComponent {

	constructor(props) {
		super(props)
		this.form = React.createRef()
	}

	onSubmit = data => {
		
		const query = querystring.stringify({
			quem: data.quem,
			paroquia: data.paroquia,
			diocese: data.diocese,
			cidade: data.cidade,
			id: data.id
		})

		window.open(mounturl + '/api/matrimonio/notificacao?' + query, '_blank')
		this.props.onCloseForm()
	}

	render() {
		const { edit, isOpen, onCloseForm, handleSubmit, submitting } = this.props
		return (
			<FormStateModal
				edit={edit}
				saving={submitting}
				isOpen={isOpen}
				onCloseForm={onCloseForm}
				onSubmit={handleSubmit(this.onSubmit)}
				title='Notificação de Matrimônio'
				submitText='Emitir'
				size='sm'>
				<Field label='Emitir para quem?' name='quem' options={options} component={InputBoolean} required />
				<Field label='Paróquia de destino' name='paroquia' component={Input} required />
				<Field label='Diocese de destino' name='diocese' component={Input} required />
				<Field label='Cidade de destino' name='cidade' component={Input} required />
			</FormStateModal>
		)
	}
}

export default FormNotificacao
