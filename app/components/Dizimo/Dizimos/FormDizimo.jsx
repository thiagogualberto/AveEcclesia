import React, { Component } from 'react'
import { Row, Col, Button, Collapse } from 'reactstrap'
import { Field, SubmissionError, reduxForm, formValueSelector } from 'redux-form'
import { connect } from 'react-redux'

import Form from '../../../elements/FormModal'
import api from '../../../api'
import format from '../../../util/formatters'
import { obj2array } from '../../../util/array'
import { IconRotate } from './styles'
import {
	InputCurrency,
	AsyncSelect,
	InputDate,
	InputBoolean,
	Select
} from '../../../lib/ReduxFormFields'

const periodo = obj2array({
	M: 'Mensal',
	T: 'Trimestral',
	S: 'Semestral',
	A: 'Anual'
})

const format_pessoa_id = item => ({
	value: item.pessoa_id,
	label: item.nome
})

// Map redux-form values to props
const selector = formValueSelector('form-dizimo')
const mapStateToProps = state => ({
	repetir: selector(state, 'repetir') || false,
	pago: selector(state, 'pago'),
})

@reduxForm({ form: 'form-dizimo', enableReinitialize: true })
@connect(mapStateToProps)
class FormDizimo extends Component {

	state = {
		collapse: false
	}

	get num_parcelas() {
		const price = format.money(this.props.pago)
		const range = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
		return [
			{ value: 1, label: `1 vez - total: R$ ${price}` },
			...(range.map(this.format_parcelas))
		]
	}

	format_parcelas = num => {
		const price = format.money(this.props.pago * num)
		return {
			value: num,
			label: `${num} vezes - total: R$ ${price}`
		}
	}

	onSubmit = async data => {

		const resp = await api.sendData('dizimo', data, this.props.edit)
		const result = resp.data

		if (!result.success) {
			throw new SubmissionError({ _error: result })
		}

		return result
	}

	toggleCollapse = () => {
		this.setState({ collapse: !this.state.collapse });
	}

	render () {
		const { repetir, edit, initialValues, submitting, error, handleSubmit, submitFailed } = this.props
		const { pessoa_nome } = initialValues
		return (
			<Form
				onSubmit={handleSubmit(this.onSubmit)}
				error={submitFailed && error.message || ''}
				saving={submitting}
				method='post'>
				<Field label='Dizimista' name='pessoa_id' model='dizimista?ativo=1' defaultText={pessoa_nome} onFormat={format_pessoa_id} component={AsyncSelect} disabled={edit} required />
				<Field label='Valor' name='pago' component={InputCurrency} required />
				<Field label='Data de devolução' name='dt_pagamento' component={InputDate} required />
				<Button color="link" onClick={this.toggleCollapse} className='mb-3' id="detail" block>
					{this.state.collapse ? 'Menos detalhes ' : 'Mais detalhes '} <IconRotate className='fa fa-angle-down' rotate={this.state.collapse} />
				</Button>
				<Collapse className='w-100' isOpen={this.state.collapse}>
					<Field label='Referência' name='dt_vencimento' component={InputDate} required />
					<Field _if={!edit} label='Repetir lançamento' name='repetir' component={InputBoolean} />
					<Field
						_if={repetir && !edit}
						label='Quantidade de vezes'
						name='num_parcelas'
						options={this.num_parcelas}
						component={Select}
						simple required
					/>
					<Field
						_if={repetir && !edit}
						label='Período'
						name='periodo'
						options={periodo}
						component={Select}
						simple required
					/>
				</Collapse>
			</Form>
		)
	}
}

export default FormDizimo