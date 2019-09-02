import React, { Component } from 'react'

import FormCrisma from './FormCrisma'
import TableCrisma from './TableCrisma'
import Container from '../../../elements/Container'

class Crismas extends Component {

	state = {
		edit: false
	}

	constructor(props) {
		super(props)
		this.form = React.createRef()
		this.table = React.createRef()
	}

	addCrisma = () => this.form.current.addData()
	editCrisma = (e, value, row) => this.form.current.editData(row)

	render() {
		return (
			<Container title='Crisma'>
				<FormCrisma
					ref={this.form}
					edit={this.state.edit}
					onSubmitSuccess={() => this.table.current.refresh()}
				/>
				<TableCrisma
					ref={this.table}
					addCrisma={this.addCrisma}
					editCrisma={this.editCrisma}
				/>
			</Container>
		)
	}
}

export default Crismas
