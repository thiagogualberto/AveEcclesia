import React, { PureComponent, Fragment } from 'react'
import { Field, reduxForm } from 'redux-form'
import { Row, Col } from 'reactstrap'
import formatters from '../../../../util/formatters'

import BootstrapTable, { Field as TH } from '../../../../elements/BootstrapTable'
import FormDizimo from '../../../Dizimo/Dizimos/FormDizimo'
import NotFilled from '../NotFilled'
import RowForm from '../../../../elements/RowForm'
import Campo from '../Campo'
import date from '../../../../util/date'
import ActionButtons from '../ActionButtons'
import FormDizimista from '../../../Dizimo/Dizimistas/FormDizimista'
import { FormStateModal } from '../../../../elements/FormModal'
// import { AsyncSelect } from '../../../../lib/ReduxFormFields'

class Dizimista extends PureComponent {

	constructor(props) {
		super(props)
		this.table = React.createRef()
		this.dizimista = React.createRef()
		this.state = { dizimoOpen: false, dizimoData: {} }
		window.format = {
			delete_message: row => 'Deseja realmente excluir esse dízimo?\n\nData: ' + formatters.date(row.dt_pagamento) + '\nValor: ' + formatters.money(row.pago)
		}
	}

	addDizimista = () => {
		this.dizimista.current.addData({
			pessoa_id:  this.props.pessoa_id,
			nome: this.props.membro.nome
		})
	}

	actions = () => [
		Action('edit', 'Editar', '', { className: 'edit' }),
		Action('trash', 'Excluir', '#dc3545', { className: 'delete' }),
	]

	editDizimo = (e, value, row) => {
		this.setState({ dizimoOpen: true, dizimoData: row })
	}

	toggle = () => {
		this.setState({ dizimoOpen: !this.state.dizimoOpen })
	}

	onSuccess = () => {
		this.table.current.refresh()
		this.toggle()
	}

	componentDidMount() {
		this.table.current.on('edit', this.editDizimo)
		this.props.loadDizimista(this.props.pessoa_id)
	}

	render = () => (
		<Fragment>
			<Row>
				<Col md={6}>
					<NotFilled
						label='dizimista'
						filled={this.props.filled}
						actions={[{ title: 'Adicionar dizimista', onClick: this.addDizimista }]}>
						<DizimistaForm
							edit={this.props.edit}
							initialValues={this.props.initialValues}
							onSubmit={this.props.onSubmit}
						/>
					</NotFilled>
				</Col>
				<Col md={6}>
					<h4 className='mb-3'>Devoluções</h4>
					<BootstrapTable
						ref={this.table}
						sortOrder='desc'
						actions={this.actions}
						url={mounturl + '/api/dizimista/' + this.props.pessoa_id + '/dizimos'}>
						<TH sortable field='dt_pagamento' formatter='date_format' width='110px' align='center'>Data</TH>
						<TH sortable field='dt_vencimento' formatter='date_format' width='110px' align='center'>Referência</TH>
						<TH sortable field='pago' formatter='money_format'>Valor</TH>
						<TH formatter='render_actions' events='events' width='90px' align='center'>Ações</TH>
					</BootstrapTable>
				</Col>
			</Row>
			<FormDizimista ref={this.dizimista} />
			<FormStateModal
				size='sm'
				title='dízimo'
				edit={true}
				onCloseForm={this.toggle}
				onSubmitSuccess={this.onSuccess}
				isOpen={this.state.dizimoOpen}
				component={FormDizimo}
				initialValues={{ pessoa_nome: this.props.membro.nome, ...this.state.dizimoData }}
			/>
		</Fragment>
	)
}

let DizimistaForm = props => (
	<form className='no-smoothState' onSubmit={props.handleSubmit}>
		<RowForm edit={props.edit}>
			{/* <Field label='Comunidade' name='comunidade_id' model='comunidade' component={AsyncSelect} /> */}
			<Field md={4} label='Data de início' type='date' name='inicio' component={Campo} formatter={date.unserialize} />
			<Field md={4} label='Nascimento cônjuge' type='date' name='dt_conjuge' component={Campo} formatter={date.unserialize} />
			<Field md={4} label='Data de casamento' type='date' name='dt_casamento' component={Campo} formatter={date.unserialize} />
			<Field label='Conjuge' name='conjuge' component={Campo} />
		</RowForm>
		<ActionButtons {...props} form='dizimista' />
	</form>
)

DizimistaForm = reduxForm({
	form: 'dizimista-form',
	enableReinitialize: true
})(DizimistaForm)

export default Dizimista