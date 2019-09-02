import React, { Component, Fragment } from 'react'
import CustomInput from 'reactstrap/lib/CustomInput'

import ButtonIcon from '../../../elements/ButtonIcon'
import CampoRedux from '../../../elements/Campo'
import Toggle from '../../../elements/Toggle'

import date from '../../../util/date'
import format from '../../../util/formatters'

const Campo = props => (
	<td><CampoRedux {...props} /></td>
)

export default class FormTransferencias extends Component {

	get data () {
		return {
			id: this.props.id || false,
			dt_transferencia: date.serialize(this.props.dt_transferencia),
			descricao: this.props.descricao || 'transferência entre contas',
			valor: this.props.valor,
			conta_origem: this.props.conta_origem,
			conta_destino: this.props.conta_destino,
			quitado: this.props.quitado
		}
	}

	validate(data) {

		let error = []

		if (!data.dt_transferencia) error.push('Data da transferência')
		if (!data.valor) error.push('Valor')
		if (!data.conta_origem) error.push('Conta de origem')
		if (!data.conta_destino) error.push('Conta de destino')

		return error
	}

	render() {
		return (
			<Fragment>
				<tr className='edit'>
					<td>
						<CustomInput
							id={'check-' + this.props.id}
							type='checkbox'
							checked={this.props.checked}
							disabled={true}
							onChange={() => this.props.toggleDelete(this.props.data)}
						/>
					</td>
					<Campo
						name='dt_transferencia'
						mask='99/99/9999'
						type='date'
						width={145}
						defaultValue={date.serialize()} />
					<Campo name='descricao' />
					<Campo name='valor' type='currency' />
					<Campo
						type='select'
						model='contas'
						name='conta_origem'
						value={this.props.conta_origem}
						onChange={this.props.onChange}
					/>
					<Campo
						type='select'
						model='contas'
						name='conta_destino'
						value={this.props.conta_destino}
						onChange={this.props.onChange}
					/>
					<td>
						<Toggle
							name='quitado'
							value={this.props.quitado}
							onChange={value => this.props.changeField('quitado', value)}
						/>
					</td>
					<td>
						<ButtonIcon type='success' icon='check' onClick={() => this.props.onSave(this.data, this.validate)} />
					</td>
				</tr>
			</Fragment>
		);
	}
}

export const RowTransferencias = props => (
	<tr>
		<td>
			<CustomInput
				id={'check-' + props.data.id}
				type='checkbox'
				checked={~props.delete.indexOf(props.data)}
				onChange={() => props.toggleDelete(props.data)}
			/>
		</td>
		<td>
			<strong>{date.format(props.data.dt_pagamento, 'DD/MM')}</strong>
		</td>
		<td>{props.data.descricao}</td>
		<td>{format.money(props.data.valor)}</td>
		<td>{props.data.conta_origem_nome}</td>
		<td>{props.data.conta_destino_nome}</td>
		<td><Toggle value={props.data.quitado} onChange={() => props.toggleQuitado(props.data)} /></td>
		<td><ButtonIcon icon='chevron-down' type='link' color='#212529' /></td>
	</tr>
)
