import React, { Component, Fragment } from 'react'
import { Row, Col, Button, Form, Card, CardBody } from 'reactstrap'
import querystring from 'querystring'

import RadioButton from '../../elements/RadioButton'
import Visibility from '../../elements/Visibility'
import DateField from '../../elements/DateField'
import Container from '../../elements/Container'

const options = [
	{ label: 'Todos Membros', value: 'membros' },
	{ label: 'Prestadores de Serviço', value: 'prestadores' },
	{ label: 'Aniversariantes', value: 'nivers' },
]

class RelatorioMembros extends Component {

	constructor(props) {
		super(props)
		this.openRelatorio = this.openRelatorio.bind(this)
		this.handleChange = this.handleChange.bind(this)
		this.state = {
			tipo: 'membros'
		}
	}

	get data() {
		return {
			start_date: this.state.start_date,
			end_date: this.state.end_date,
			tipo: this.state.tipo
		}
	}

	openRelatorio(e) {

		e.preventDefault()
		e.stopPropagation()

		const query = querystring.stringify(this.data)
		window.open(window.mounturl + '/api/relatorio/membros?' + query)
	}

	handleChange({ target }) {
		this.setState({
			[target.name]: target.value
		});
	}
	
	render () {
		return (
			<Container title='Relatório de Membros'>
				<Form onSubmit={this.openRelatorio}>
					<Row>
						<Col md={6}>
							<Card className='mb-3'>
								<CardBody>
									<h5 className='mb-3'>Selecione uma opção <span className="text-danger">*</span></h5>
									<Row>
										<RadioButton name='tipo' options={options} onChange={this.handleChange} required />
									</Row>
								</CardBody>
							</Card>
							<Visibility visible={this.state.tipo == 'nivers'}>
								<Row>
									<DateField label='Data inicial' name='start_date' onChange={this.handleChange} required />
									<DateField label='Data final' name='end_date' onChange={this.handleChange} required />
								</Row>
							</Visibility>
							<Button type='submit' color='primary'>Gerar relatório</Button>
						</Col>
					</Row>
				</Form>
			</Container>
		)
	}
}

export default RelatorioMembros