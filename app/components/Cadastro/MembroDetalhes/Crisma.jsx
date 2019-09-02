import React, { Fragment, PureComponent } from 'react'
import { Field, reduxForm } from 'redux-form'
import { Row, Col } from 'reactstrap'

import FormCrisma from '../../Sacramentos/Crismas/FormCrisma'
import NotFilled from './NotFilled'
import RowForm from '../../../elements/RowForm';
import Campo from './Campo'
import date from '../../../util/date';
import ActionButtons from './ActionButtons';

class Crisma extends PureComponent {

	constructor(props) {
		super(props)
		this.crisma = React.createRef()
	}

	componentDidMount() {
		this.props.loadCrisma(this.props.pessoa_id)
	}

	addCrisma = () => {
		this.crisma.current.addData({
			pessoa_id: {
				value: this.props.pessoa_id,
				label: this.props.membro.nome
			}
		})
	}

	onSuccess = data => {
		this.props.updateForm('crisma', data)
	}

	render = () => (
		<Fragment>
			<NotFilled
				label='crisma'
				filled={this.props.filled}
				actions={[{ title: 'Adicionar crisma', onClick: this.addCrisma }]}>
				<CrismaForm
					edit={this.props.edit}
					initialValues={this.props.initialValues}
					onSubmit={this.props.onSubmit}
				/>
			</NotFilled>
			<FormCrisma
				ref={this.crisma}
				onSubmitSuccess={this.onSuccess}
			/>
		</Fragment>
	)
}

let CrismaForm = props => (
	<form className='no-smoothState' onSubmit={props.handleSubmit}>
		<Row>
			<Col md={6}>
				<RowForm edit={props.edit}>
					<Field md={4} label='Data de crisma' type='date' name='dt_crisma' component={Campo} formatter={date.unserialize} />
					<Field md={8} label='Paróquia' name='paroquia' component={Campo} />
					<Field label='Padrinho' name='padrinho' component={Campo} />
					<Field label='Madrinha' name='madrinha' component={Campo} />
					<Field label='Celebrante' name='celebrante' component={Campo} />
					<Field md={4} label='Livro' name='livro' component={Campo} />
					<Field md={4} label='Folha' name='folha' component={Campo} />
					<Field md={4} label='Registro' name='registro' component={Campo} />
				</RowForm>
			</Col>
		</Row>
		<ActionButtons {...props} form='crisma' />
	</form>
)

CrismaForm = reduxForm({
	form: 'crisma-form',
	enableReinitialize: true
})(CrismaForm)

export default Crisma