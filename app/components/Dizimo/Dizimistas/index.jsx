import React, { Component } from 'react'
import '../../../util/formatters'

import FormDizimista from './FormDizimista'
import TableDizimistas from './TableDizimistas'
import Container from '../../../elements/Container'

class Dizimistas extends Component {

	constructor (props) {
		super(props)
		this.form = React.createRef()
		this.table = React.createRef()
	}

	editarDizimista = (e, value, row) => {
		this.form.current.editData(row)
	}

	adicionarDizimista = () => {
		this.form.current.addData()
	}

	refreshTable = () => {
		this.table.current.refresh()
	}

	render = () => (
		<Container title='Dizimistas'>
			<FormDizimista
				ref={this.form}
				onSubmitSuccess={this.refreshTable}
			/>
			<TableDizimistas
				innerRef={this.table}
				onEdit={this.editarDizimista}
				onAdd={this.adicionarDizimista}
			/>
		</Container>
	)
}

export default Dizimistas
