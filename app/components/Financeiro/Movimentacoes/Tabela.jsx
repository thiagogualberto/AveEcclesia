import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { CustomInput, Button, Spinner } from 'reactstrap'
import format from '../../../util/formatters'
import './Tabela.css'

import ButtonIcon from '../../../elements/ButtonIcon'
import FadingComponent from '../../../elements/FadingComponent'
import TableForm from '../../../elements/TableForm'

import { addData, deleteData, checkAllDelete, filterChange, nextPage } from '../../../actions/transacoesAction'
import ToobarFiltro from '../../../elements/ToolbarFiltro'
import { VisibilityRow } from '../../../elements/Visibility'

class Tabela extends Component {

	static defaultProps = {
		edit: undefined,
		rows: [],
		thead: [],
		total: 0
	}

	get deleteSum() {
		return this.props.delete.map(row => row.pago || row.valor || 0).reduce((a, b) => a + b)
	}

	render = () => {
		const { thead, rows, total, deleteData, filterChange } = this.props
		const lines = rows.length
		return (
			<Fragment>
				<div className='table-responsive'>
					{!this.props.delete.length ? (
						<ToobarFiltro onChange={filterChange} />
					) : (
						<ToobarDelete
							onDelete={deleteData}
							onClose={() => this.props.checkAllDelete(false)}
							length={this.props.delete.length}
							deleteSum={this.deleteSum} />
					)}
					<table className='table table-sm-responsive mb-0'>
						<thead>
							<tr>
								<th width={40}>
									<CustomInput
										id='check-all'
										type='checkbox'
										checked={this.props.delete.length > 0 && this.props.delete.length == lines}
										onChange={e => this.props.checkAllDelete(e.target.checked)}
									/>
								</th>
								{ thead.map((th, idx) => <th key={idx} width={th.width}>{th.title}</th>) }
							</tr>
						</thead>
						<tbody>
							<ButtonNewItem
								type={this.props.btnType}
								title={this.props.btnTitle}
								onClick={this.props.addData}
								visible={!this.props.edit || this.props.edit.id !== 0}
							/>
							<NoResult visible={!this.props.loading && !lines} />
							{ rows.map(row => <TableForm key={row.id} data={row} />) }
							<LoadingRow visible={this.props.loading} />
						</tbody>
					</table>
				</div>
				<div className='text-center mt-3'>
					<p>Listando {lines} de {total} registros.</p>
					<Button color='outline-dark' size='sm' className={lines < total ? 'ml-auto mr-auto' : 'd-none'} onClick={this.props.nextPage}>
						Ver mais <i className='fa fa-arrow-down' />
					</Button>
				</div>
			</Fragment>
		)
	}
}

const LoadingRow = props => (
	<VisibilityRow visible={props.visible}>
		<td colSpan={8} className='col text-center p-3'>
			<FadingComponent>
				<Spinner size='sm' /> Carregando transações
			</FadingComponent>
		</td>
	</VisibilityRow>
)

const NoResult = props => (
	<VisibilityRow visible={props.visible}>
		<td colSpan={8} className='col text-center p-3'>
			<FadingComponent>
				Nenhuma transação
			</FadingComponent>
		</td>
	</VisibilityRow>
)

const ButtonNewItem = props => (
	<VisibilityRow visible={props.visible}>
		<td colSpan={8} className='col'>
			<ButtonIcon
				icon='plus'
				type={props.type}
				className='btn-pill col-8 offset-2'
				title={props.title}
				onClick={props.onClick}
			/>
		</td>
	</VisibilityRow>
)

const ToobarDelete = props => (
	<FadingComponent className='toolbar' style={{ backgroundColor: '#393a3d'}}>
		<ButtonIcon
			icon='trash'
			type='outline-light'
			title='Excluir'
			size='sm'
			onClick={props.onDelete}
		/>
		<span className='ml-2'>
			<strong className='text-white'>{props.length} </strong>
			<span className='text-light'>
				{props.length == 1 ? 'transação selecionada' : 'transações selecionadas'} - {format.money(props.deleteSum)}
			</span>
		</span>
		<ButtonIcon
			icon='times'
			type='link'
			size='sm'
			color='white'
			className='float-right'
			onClick={props.onClose}
		/>
	</FadingComponent>
)

const mapStateToProps = ({ transacoes }) => ({
	loading: transacoes.loading,
	delete: transacoes.delete,
	thead: transacoes.tab.thead,
	total: transacoes.total,
	rows: transacoes.rows,
	edit: transacoes.edit,
	...transacoes.tab
})

const mapDispatchToProps = {
	addData, deleteData, checkAllDelete, filterChange, nextPage
}

export default connect(mapStateToProps, mapDispatchToProps)(Tabela)