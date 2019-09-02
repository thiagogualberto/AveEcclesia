import React, { PureComponent, Fragment } from 'react'
import { Collapse } from 'reactstrap'
import { connect } from 'react-redux'
import './TableForm.css'

import FormReceitas, { RowReceitas } from '../components/Financeiro/Movimentacoes/FormReceitas'
import FormDespesas, { RowDespesas } from '../components/Financeiro/Movimentacoes/FormDespesas'
import FormTransferencias, { RowTransferencias } from '../components/Financeiro/Movimentacoes/FormTransferencias'
import ButtonIcon from '../elements/ButtonIcon'

import {
	saveData,
	cancelEdit,
	editData,
	toggleDelete,
	toggleQuitado,
	changeField,
	tableChange,
	deleteItem
} from '../actions/transacoesAction'

const forms = {
	'receitas': FormReceitas,
	'despesas': FormDespesas,
	'transferencias': FormTransferencias
}

const rows = {
	'receitas': RowReceitas,
	'despesas': RowDespesas,
	'transferencias': RowTransferencias
}

class TableForm extends PureComponent {

	escFunction = event => {
		if (event.keyCode === 27) {
			this.props.cancelEdit()
		}
	}
	
	componentDidMount() {
		document.addEventListener('keydown', this.escFunction, false);
	}
	
	componentWillUnmount() {
		document.removeEventListener('keydown', this.escFunction, false);
	}

	onSave = (data, validate = false) => {
		
		// Validação default
		validate = validate || (data => {

			let error = []

			if (!data.dt_pagamento) error.push('Data de pagamento')
			if (!data.pessoa_id) error.push('Recebedor / Pagador')
			if (!data.pago) error.push('Valor Pago / Recebido')
			if (!data.plano_contas) error.push('Categoria')
	
			return error
		})

		// Pega os erros
		const error = validate(data)

		// Continua ou exibe erro
		if (error.length) {
			alert('Você deve informar os campos:\n\n-> ' + error.join('\n-> '))
		} else {
			this.props.saveData(this.props.action, data)
		}
	}

	onChange = (e) => {
		const { name, value } = e.target
		this.props.changeField(name, value)
	}

	toggleQuitado = data => {
		this.props.toggleQuitado(this.props.action, data)
	}

	render () {

		const Row = rows[this.props.action]
		const Form = forms[this.props.action]
		const { data, ...props } = this.props

		if (!!data.id && (props.edit === undefined || props.edit.id !== data.id)) {
			return <Row {...props} data={data} toggleQuitado={this.toggleQuitado} />
		} else {
			return <Form {...props} onSave={this.onSave} onChange={this.onChange} />
		}
	}
}

export class CollapseForm extends PureComponent {

	state = { collapse: false }

	render() {
		return (
			<Fragment>
				<tr></tr>
				<tr className='edit'>
					<td style={{ borderTop: 'none' }}></td>
					<td colSpan={7} style={{ position: 'relative', borderTop: 'none', padding: 15 }}>
						<ButtonIcon
							type='link'
							className='btn-sm btn-detalhes'
							icon={this.state.collapse ? 'angle-up' : 'angle-down'}
							title={this.state.collapse ? 'Menos detalhes' : 'Mais detalhes'}
							onClick={() => this.setState({ collapse: !this.state.collapse })}
						/>
						<Collapse isOpen={this.state.collapse}>
							<hr />
							{ this.props.children }
							<div className='row'>
								<div className='col-4'>
									<button className='btn mt-3 mr-3' onClick={this.props.onCancel}>Cancelar</button>
									<button className='btn btn-success mt-3' onClick={this.props.onSave}>Salvar</button>
								</div>
							</div>
						</Collapse>
					</td>
				</tr>
			</Fragment>
		)
	}
}

export const Item = props => {
	const { small, children, ...attrs }	= props
	return (
		<td {...attrs}>
			{!!props.small ? <small>{children}</small> : children}
		</td>
	)
}

const mapStateToProps = state => ({
	delete: state.transacoes.delete,
	action: state.transacoes.tab.action,
	edit: state.transacoes.edit,
	...state.transacoes.edit
})

const mapDispatchToProps = {
	saveData,
	editData,
	cancelEdit,
	toggleDelete,
	toggleQuitado,
	changeField,
	tableChange,
	deleteItem
}

export default connect(mapStateToProps, mapDispatchToProps)(TableForm)