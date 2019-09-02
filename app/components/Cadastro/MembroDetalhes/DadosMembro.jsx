import React, { PureComponent } from 'react'
import { Field, reduxForm } from 'redux-form'

import { Row, Col } from 'reactstrap'
import ActionButtons from './ActionButtons'
import date from '../../../util/date';
import RowForm from '../../../elements/RowForm';
import Campo from './Campo'

const optionsSN = [
	{ value: 1, label: 'Sim' },
	{ value: 0, label: 'Não' }
]

const optionsSexo = [
	{ value: 'M', label: 'Masculino' },
	{ value: 'F', label: 'Feminino' }
]

const optionsEstadoCivil = [
	{ value: 'S', label: 'Solteiro' },
	{ value: 'C', label: 'Casado' },
	{ value: 'D', label: 'Divorciado' },
	{ value: 'V', label: 'Viúvo' }
]

function find_label(array, value) {
	if (value !== null && value !== '' && value !== '-')
		return array.find(val => val.value == value).label
	else
		return ''
}

function sexo_formatter(value) {
	return find_label(optionsSexo, value)
}

function estado_civil_formatter(value) {
	return find_label(optionsEstadoCivil, value)
}

function boolean_formatter(value) {
	return find_label(optionsSN, value)
}

class DadosMembro extends PureComponent {
	render = () => (
		<form className='form-fill no-smoothState' onSubmit={this.props.handleSubmit}>
			<Row>
				<Col>
					<RowForm edit={this.props.edit}>
						<Field label='Nome' name='nome' component={Campo} />
						<Field md={4} label='Nascimento' type='date' name='dt_nascimento' component={Campo} formatter={date.unserialize} />
						<Field md={4} label='CPF' mask='999.999.999-99' name='cpf_cnpj' component={Campo} />
						<Field md={4} label='Identidade' name='rg' component={Campo} />
						<Field label='Nome do Pai' name='pai' component={Campo} />
						<Field label='Nome da Mãe' name='mae' component={Campo} />
						<Field md={4} label='Falecido' type='select' name='falecido' component={Campo} options={optionsSN} formatter={boolean_formatter} simple />
						<Field md={4} label='Sexo' type='select' name='sexo' component={Campo} options={optionsSexo} formatter={sexo_formatter} simple />
						<Field md={4} label='Estado Civil' type='select' name='estado_civil' component={Campo} formatter={estado_civil_formatter} options={optionsEstadoCivil} simple />
					</RowForm>
				</Col>
				<Col>
					<RowForm edit={this.props.edit}>
						<Field label='E-mail' name='email' component={Campo} />
						<Field md={4} label='Telefone' name='tel' component={Campo} mask='(99) 9999-9999' />
						<Field md={4} label='Celular' name='cel' component={Campo} mask='(99) 99999-9999' />
						<Field md={4} label='CEP' name='cep' component={Campo} mask='99999-999' />
						<Field md={4} label='Estado' name='uf' component={Campo} />
						<Field md={8} label='Cidade' name='cidade' component={Campo} />
						<Field md={9} label='Endereço' name='endereco' component={Campo} />
						<Field md={3} label='Número' name='numero' component={Campo} />
						<Field label='Complemento' name='complemento' component={Campo} />
					</RowForm>
				</Col>
			</Row>
			<ActionButtons {...this.props} form='membro' />
		</form>
	)
}

export default reduxForm({
	form: 'dados-membro',
	enableReinitialize: true
})(DadosMembro)
