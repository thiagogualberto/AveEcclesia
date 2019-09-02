import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { Col, Row, Nav, NavItem, NavLink, UncontrolledCollapse, Button, Card, CardBody } from 'reactstrap'
import './Movimentacoes.css'

import { selectTab, changeInitialDate } from '../../../actions/transacoesAction'
import api from '../../../api'
import Tabela from './Tabela'
import Dropdown from '../../../elements/Dropdown'
import Calendar from '../../../elements/Calendar'
import tabs from '../../../util/tabs'
import Resumo from './Resumo';
import Icon from '../../../elements/Icon'
import Container from '../../../elements/Container'
import format from '../../../util/formatters'

class Movimentacoes extends Component {

	static defaultProps = {
		tab: tabs[0]
	}

	componentWillMount() {
		this.props.selectTab(tabs[0])
	}

	renderTabs = (tab, index) => (
		<NavItem key={tab.action}>
			<NavLink
				active={this.props.tab == tab}
				style={{ borderTop: this.props.tab == tab && '2px solid ' + tab.color }}
				onClick={() => this.props.selectTab(tab)}
				href='#'>
				{tab.title}
			</NavLink>
		</NavItem>
	)

	render() {
		return (
			<Container title='Movimentações'>
				<UncontrolledCollapse toggler='toggle_info'>
					<Card>
						<CardBody>
							<Row>
								<Resumo />
								<Col md />
								<Col md='3'>
									<Contas />
								</Col>
							</Row>
						</CardBody>
					</Card>
				</UncontrolledCollapse>
				<div className='text-center mb-2'>
					<Button size='sm' color='link' id='toggle_info'>
						Informações gerais <Icon name='angle-down' />
					</Button>
				</div>

				<Nav className='table-financeiro pt-4 mt-4' tabs>
					<Calendar onChange={this.props.changeInitialDate} />
					{ tabs.map(this.renderTabs) }
				</Nav>
				<Tabela	/>
			</Container>
		);
	}
}

// const tipos_conta = {
// 	'CE': 'Caixa Escritório',
// 	'CC': 'Conta Corrente',
// 	'CP': 'Conta Poupança'
// }

class Contas extends Component {

	state = {
		saldoPrevisto: 2732,
		contas: [],
		conta: {
			id: 1,
			nome: 'Caixa Escritório',
			saldo: 0
		}
	};

	async componentDidMount () {

		const resp = await api.loadContas()
		const rows = resp.data.rows

		this.setState({
			contas: resp.data.rows,
			conta: rows[0]
		})
	}

	render () {
		return (
			<Fragment>
				<p className='text-muted mb-2'>CONTA</p>
				<Dropdown
					className='mb-3'
					items={this.state.contas}
					title={'Saldo ' + this.state.conta.nome}
					format={item => item.nome}
					onSelect={conta => this.setState({ conta })}
				/>
				<h4 className='text-success'>{format.money(this.state.conta.saldo)}</h4>
				{/* <p className='text-muted'>
					<small>
						<span>Previsão de fechamento do mês</span><br />
						<strong>{format.money(this.state.saldoPrevisto)}</strong>
					</small>
				</p> */}
				<hr className='d-md-none' />
			</Fragment>
		);
	}
}

const mapStateToProps = state => ({
	tab: state.transacoes.tab
})

const mapDispatchToProps = {
	selectTab, changeInitialDate
}

export default connect(mapStateToProps, mapDispatchToProps)(Movimentacoes)