import React, { Component, Fragment } from 'react'
import { Row, Col, Button, Form, Card, CardBody, FormGroup, Label } from 'reactstrap'
import querystring from 'querystring'
import omitBy from 'lodash/omitBy'
import isUndefined from 'lodash/isUndefined'

import RadioButton from '../../elements/RadioButton'
import Visibility from '../../elements/Visibility'
import DateField from '../../elements/DateField'
import ReactSelect from '../../elements/Select'
import Container from '../../elements/Container'

const options1 = [
	{ label: 'Dizimistas - Listagem', value: 'lista' },
	{ label: 'Dizimistas - Aniversariantes', value: 'nivers' },
]

const options2 = [
	{ label: 'Dizimistas - Aniversário Casamento', value: 'niver_casamento' },
	{ label: 'Dizimistas - Aniversário Cônjuges', value: 'niver_conjuge' },
]

const options3 = [
	{ label: 'Dízimos Recebidos Geral', value: 'recebidos' },
	{ label: 'Dízimos Recebidos por Dizimista', value: 'recebido_dizimista' },
	{ label: 'Dízimos Recebidos por Comunidade', value: 'recebido_comunidade' },
]

class RelatorioDizimos extends Component {

	constructor(props) {
		super(props)
		this.openRelatorio = this.openRelatorio.bind(this)
		this.handleChange = this.handleChange.bind(this)
		this.state = {
			tipo: 'lista'
		}
	}

	get data() {

		const data = {
			dizimista: this.state.dizimista,
			comunidade: this.state.comunidade,
			start_date: this.state.start_date,
			end_date: this.state.end_date,
			tipo: this.state.tipo
		}

		return omitBy(data, isUndefined)
	}

	openRelatorio(e) {

		e.preventDefault()
		e.stopPropagation()

		const query = querystring.stringify(this.data)
		window.open(window.mounturl + '/api/relatorio/dizimos?' + query)
	}

	handleChange({ target }) {
		this.setState({
			[target.name]: target.value
		});
	}
	
	render () {
		return (
			<Container title='Relatório de Dízimos'>
				<Form onSubmit={this.openRelatorio}>
					<Row>
						<Col md={8}>
							<Card className='mb-3'>
								<CardBody>
									<h5 className='mb-3'>Selecione uma opção <span className="text-danger">*</span></h5>
									<Row>
										<RadioButton name='tipo' options={options1} onChange={this.handleChange} required />
										<RadioButton name='tipo' options={options2} onChange={this.handleChange} required />
									</Row>
									<hr/>
									<Row>
										<RadioButton name='tipo' options={options3} onChange={this.handleChange} required />
										<Visibility visible={!['recebidos', 'recebido_dizimista'].includes(this.state.tipo)}>
											<Select
												name='comunidade'
												model='comunidade'
												label='Comunidade'
												onChange={this.handleChange}
												clearable
												required={this.state.tipo === 'recebido_comunidade'}
												/>
										</Visibility>
										<Visibility visible={['recebido_dizimista'].includes(this.state.tipo)}>
											<Select
												name='dizimista'
												model='dizimista?ativo=1'
												label='Dizimista'
												onChange={this.handleChange}
												required
												/>
										</Visibility>
									</Row>
								</CardBody>
							</Card>
							<VisibilityRow visible={!['lista'].includes(this.state.tipo)}>
								<DateField label='Data inicial' name='start_date' onChange={this.handleChange} required />
								<DateField label='Data final' name='end_date' onChange={this.handleChange} required />
							</VisibilityRow>
							<Button type='submit' color='primary'>Gerar relatório</Button>
						</Col>
					</Row>
				</Form>
			</Container>
		)
	}
}

const VisibilityRow = props => (
	<Visibility visible={props.visible}>
		<Row>{props.children}</Row>
	</Visibility>
)

const Select = props => (
	<Col>
		<FormGroup>
			<Visibility visible={!!props.label}>
				<Label htmlFor={'id_' + props.name}>
					{props.label}
					{props.required && <span className='text-danger'> *</span>}
				</Label>
			</Visibility>
			<ReactSelect
				id={'id_' + props.name}
				name={props.name}
				model={props.model}
				required={props.required}
				onChange={props.onChange}
			/>
		</FormGroup>
	</Col>
)

export default RelatorioDizimos