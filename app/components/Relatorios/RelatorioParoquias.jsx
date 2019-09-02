import React, { Component, Fragment } from 'react'
import { Col, Row, Form, Button, Card, CardBody } from 'reactstrap'
import querystring from 'querystring'

import RadioButton from '../../elements/RadioButton'
import DateField from '../../elements/DateField'
import Container from '../../elements/Container'

const options1 = [
	{ label: 'Repasse de dízimo', value: 'repasse' },
	{ label: 'Resumo de repasse', value: 'resumo' },
	// { label: 'Despesas em Aberto', value: 'despesa_pendente' },
	// { label: 'Receitas em Aberto', value: 'receita_pendente' },
	// { label: 'Demonstrativo de Receitas e Despesas', value: 'demonstrativo' }
]

// const options2 = [
// 	{ label: '--- Resumo Anual', value: 'anual' },
// 	{ label: 'Despesas Liquidadas', value: 'pago' },
// 	{ label: 'Receitas Liquidadas', value: 'recebido' },
// 	{ label: 'Resumo Analítico', value: 'analitico' }
// ]

class RelatorioParoquias extends Component {

	get data() {
		return {
			start_date: this.state.start_date,
			end_date: this.state.end_date
		}
	}

	openRelatorio = (e) => {

		e.preventDefault()
		e.stopPropagation()

		const query = querystring.stringify(this.data)
		window.open(`${window.mounturl}/api/relatorio/paroquias/${this.state.tipo}?${query}`)
	}

	handleChange = ({ target }) => {
		this.setState({
			[target.name]: target.value
		});
	}

	render() {
		return (
			<Container title='Relatório de Paróquias'>
				<Row>
					<Col md={6}>
						<Form onSubmit={this.openRelatorio}>
							<Row>
								<DateField label='Data inicial' name='start_date' onChange={this.handleChange} required />
								<DateField label='Data final' name='end_date' onChange={this.handleChange} required />
							</Row>
							<Card>
								<CardBody>
									<h5 className='mb-3'>Selecione uma opção <span className="text-danger">*</span></h5>
									<Row>
										<RadioButton name='tipo' onChange={this.handleChange} options={options1} required />
										{/* <RadioButton name='tipo' onChange={this.handleChange} options={options2} required /> */}
									</Row>
								</CardBody>
							</Card>
							<Button type='submit' color='primary' className='mt-3'>Gerar relatório</Button>
						</Form>
					</Col>
				</Row>
			</Container>
		)
	}
}

export default RelatorioParoquias
