import React, { Component } from 'react'
import { Col, Row } from 'reactstrap'
import { connect } from 'react-redux'

import ProgressBar from './ProgressBar'
import { loadResumo } from '../../../actions/contasAction'

class Resumo extends Component {

	static defaultProps = {
		total_previsto: '',
		receita_quitada: '',
		despesa_quitada: '',
		receita_prevista: '',
		despesa_prevista: ''
	}

	get percent_receita() {
		return this.props.receita_quitada * 100 / this.props.receita_prevista || 0
	}

	get percent_despesa() {
		return this.props.despesa_quitada * 100 / this.props.despesa_prevista || 0
	}

	format(value) {

		if (value === '') {
			return 'R$ ...'
		}

		return money_format(value)
	}

	componentDidMount() {
		this.props.loadResumo()
	}

	render() {
		return (
			<Col md>
				<p className='text-muted'>RESULTADO PREVISTO PARA O MÊS</p>
				<h2>{this.format(this.props.total_previsto)}</h2>
				<hr className='d-md-none' />
				<Row className='mt-5'>
					<Col>
						<h6 className='text-muted'>RECEITAS</h6>
						<ProgressBar color='bg-success' percent={this.percent_receita} />
						<p className='mb-0 mt-0 small'>
							Recebido: <strong className='text-success float-right'>{this.format(this.props.receita_quitada)}</strong>
						</p>
						<p className='mb-0 mt-0 small text-muted'>
							Previsto: <strong className='float-right'>{this.format(this.props.receita_prevista)}</strong>
						</p>
					</Col>
					<Col>
						<h6 className='text-muted'>DESPESAS</h6>
						<ProgressBar color='bg-danger' percent={this.percent_despesa} />
						<p className='mb-0 mt-0 small'>
							Recebido: <strong className='text-danger float-right'>{this.format(this.props.despesa_quitada)}</strong>
						</p>
						<p className='mb-0 mt-0 small text-muted'>
							Previsto: <strong className='float-right'>{this.format(this.props.despesa_prevista)}</strong>
						</p>
					</Col>
				</Row>
			</Col>
		)
	}
}

const mapStateToProps = state => {
	const resumo = state.contas.resumo
	return {
		...resumo,
		total_previsto: resumo.saldo_anterior + resumo.receita_prevista - resumo.despesa_prevista
	}
}

const mapDispatchToProps = {
	loadResumo
}

export default connect(mapStateToProps, mapDispatchToProps)(Resumo)