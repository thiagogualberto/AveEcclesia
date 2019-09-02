import React, { Fragment, PureComponent } from 'react'
import { Field, reduxForm } from 'redux-form'
import { Row, Col } from 'reactstrap'

import FormBatismo from '../../Sacramentos/Batismos/FormBatismo'
import NotFilled from './NotFilled'
import RowForm from '../../../elements/RowForm';
import Campo from './Campo'
import date from '../../../util/date';
import ActionButtons from './ActionButtons';

class Batismo extends PureComponent {

	constructor(props) {
		super(props)
		this.batismo = React.createRef()
	}

	componentDidMount() {
		this.props.loadBatismo(this.props.pessoa_id)
	}

	addBatismo = () => {
		this.batismo.current.addData({
			pessoa_id: {
				value: this.props.pessoa_id,
				label: this.props.membro.nome
			}
		})
	}

	onSuccess = data => {
		this.props.updateForm('batismo', data)
	}

	render = () => (
		<Fragment>
			<NotFilled
				label='batismo'
				filled={this.props.filled}
				actions={[{ title: 'Adicionar batismo', onClick: this.addBatismo }]}>
				<BatismoForm
					edit={this.props.edit}
					initialValues={this.props.initialValues}
					onSubmit={this.props.onSubmit}
				/>
			</NotFilled>
			<FormBatismo
				ref={this.batismo}
				onSubmitSuccess={this.onSuccess}
			/>
		</Fragment>
	)
}

let BatismoForm = props => (
	<form className='no-smoothState' onSubmit={props.handleSubmit}>
		<Row>
			<Col md={6}>
				<RowForm edit={props.edit}>
					<Field label='Nome de batismo' name='nome_batismo' component={Campo} />
					<Field md={4} label='Data de batismo' type='date' name='dt_batismo' component={Campo} formatter={date.unserialize} />
					<Field md={8} label='Paróquia' name='paroquia' component={Campo} />
					<Field label='Padrinho' name='padrinho' component={Campo} />
					<Field label='Madrinha' name='madrinha' component={Campo} />
					<Field label='Celebrante' name='celebrante' component={Campo} />
					<Field md={4} label='Livro' name='livro' component={Campo} />
					<Field md={4} label='Folha' name='folha' component={Campo} />
					<Field md={4} label='Registro' name='registro' component={Campo} />
					<Field label='Observação' type='textarea' name='obs' component={Campo} />
				</RowForm>
			</Col>
		</Row>
		<ActionButtons {...props} form='batismo' />
	</form>
)

BatismoForm = reduxForm({
	form: 'batismo-membro',
	enableReinitialize: true
})(BatismoForm)

export default Batismo