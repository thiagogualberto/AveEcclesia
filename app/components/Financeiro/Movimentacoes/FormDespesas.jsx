import React, { Component, Fragment } from 'react'
import { Row, Col, CustomInput, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap'

import Toggle from '../../../elements/Toggle'
import CampoRedux from '../../../elements/Campo'
import Icon from '../../../elements/Icon'

import date from '../../../util/date'
import { CollapseForm, Item } from '../../../elements/TableForm'
import RowStatusIcon from '../../../elements/RowStatusIcon'
import ButtonIcon from '../../../elements/ButtonIcon'
import format from '../../../util/formatters'

const Campo = props => (
	<td><CampoRedux {...props} /></td>
)

export default class FormDespesas extends Component {

	get data () {
		return {
			id: this.props.id || false,
			conta_id: this.props.conta_id,
			pessoa_id: this.props.pessoa_id,
			paroquia_id: this.props.paroquia_id,
			descricao: this.props.descricao || null,
			dt_pagamento: date.serialize(this.props.dt_pagamento),
			dt_vencimento: date.serialize(this.props.dt_vencimento || this.props.dt_pagamento),
			plano_contas: this.props.plano_contas,
			comments: this.props.comments || null,
			pagamento: this.props.pagamento || 'A',
			parcela: this.props.parcela,
			periodo: this.props.periodo,
			quitado: this.props.quitado,
			valor: this.props.valor,
			pago: this.props.pago,
		}
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
					<Campo name='dt_pagamento' mask='99/99/9999' type='date' width={145} defaultValue={date.serialize()} />
					<Campo name='descricao' />
					<Campo
						name='pessoa_id'
						type='select'
						model='pessoas'
						onChange={this.props.onChange}
						format={item => ({ value: item.id, label: item.nome })}
						defaultValue={this.props.pessoa_id ? { value: this.props.pessoa_id, label: this.props.pessoa_nome } : []}
					/>
					<Campo name='pago' type='currency' />
					<Campo
						name='plano_contas'
						type='select'
						model={'plano-contas/' + this.props.action}
						format={item => ({ value: item.id, label: item.descricao })}
						defaultValue={this.props.plano_contas ? { value: this.props.plano_contas, label: this.props.categoria_descricao } : []}
					/>
					<td>
						<Toggle
							name='quitado'
							value={this.props.quitado}
							onChange={value => this.props.changeField('quitado', value)}
						/>
					</td>
					<td>
						<ButtonIcon type='success' icon='check' onClick={() => this.props.onSave(this.data)} />
					</td>
				</tr>
				<CollapseForm onSave={() => this.props.onSave(this.data)} onCancel={this.props.cancelEdit}>
					<Row>
						<Col md='2'>
							<CampoRedux type='date' mask='99/99/9999' title='Competência' name='dt_vencimento' />
						</Col>
						<Col md='3'>
							<CampoRedux
								type='select'
								title='Conta'
								model='contas'
								name='conta_id'
								defaultFirst
								defaultValue={{ value: this.props.conta_id, label: this.props.conta_nome }}
							/>
						</Col>
						<Col md='3'>
							<CampoRedux type='currency' title='Valor' name='valor' />
						</Col>
					</Row>
					<Row className='mt-4'>
						<Col md='5'>
							<CampoRedux type='textarea' title='Comentários' name='comments' />
						</Col>
					</Row>
				</CollapseForm>
			</Fragment>
		);
	}
}

export const RowDespesas = props => {
	const editData = () => props.editData(props.data)
	return (
		<tr>
			<td>
				<CustomInput
					id={'check-' + props.data.id}
					type='checkbox'
					checked={~props.delete.indexOf(props.data)}
					onChange={() => props.toggleDelete(props.data)}
				/>
			</td>
			<Item onClick={editData}>
				<strong>{date.format(props.data.dt_pagamento, 'DD/MM')}</strong>
				<RowStatusIcon check={props.data.quitado} />
			</Item>
			<Item onClick={editData} small>{props.data.descricao || <em className='text-muted'>sem descrição</em>}</Item>
			<Item onClick={editData} small>{props.data.pessoa_nome}</Item>
			<Item onClick={editData}>{format.money(props.data.pago)}</Item>
			<Item onClick={editData} small>{props.data.categoria_descricao}</Item>
			<td><Toggle value={props.data.quitado} onChange={() => props.toggleQuitado(props.data)} /></td>
			<td>
				<UncontrolledDropdown>
					<DropdownToggle color='link'>
						<Icon name='chevron-down' color='#212529' />
					</DropdownToggle>
					<DropdownMenu right>
						<DropdownItem href={`${mounturl}/api/despesas/${props.data.id}/recibo`} target='_blank'>
							<Icon name='file' />Recibo
						</DropdownItem>
						<DropdownItem onClick={() => props.deleteItem(props.data.id)}>
							<Icon name='trash' color='#dc3545' />Excluir
						</DropdownItem>
					</DropdownMenu>
				</UncontrolledDropdown>
			</td>
		</tr>
	)
}
