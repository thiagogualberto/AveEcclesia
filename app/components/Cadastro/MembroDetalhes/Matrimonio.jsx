import React, { Fragment, PureComponent } from 'react'
import { Field, reduxForm } from 'redux-form'
import { Row, Col } from 'reactstrap'

import FormMatrimonio from '../../Sacramentos/Matrimonios/FormMatrimonio'
import FormSimplificado from '../../Sacramentos/Matrimonios/FormSimplificado'
import { modalChange } from '../../../elements/FormModal'
import NotFilled from './NotFilled'
import RowForm from '../../../elements/RowForm';
import Campo from './Campo'
import date from '../../../util/date';
import ActionButtons from './ActionButtons';

class Matrimonio extends PureComponent {

	constructor(props) {
		super(props)
		this.matrimonio = React.createRef()
		this.simplificado = React.createRef()
	}

	get membro() {
		return this.props.membro.sexo === 'M' ? 'noivo_nome' : 'noiva_nome'
	}

	get membro_id() {
		return this.props.membro.sexo === 'M' ? 'noivo_id' : 'noiva_id'
	}

	get conjuge() {
		return this.props.membro.sexo === 'F' ? 'noivo_nome' : 'noiva_nome'
	}

	get pessoa() {
		return {
			value: this.props.pessoa_id,
			label: this.props.membro.nome
		}
	}

	addMatrimonio = () => {
		this.matrimonio.current.addData({
			[this.membro_id]: this.pessoa,
			[this.membro]: this.props.membro.nome
		})
	}

	addSimplificado = () => {
		this.simplificado.current.addData({
			[this.membro_id]: this.pessoa,
			[this.membro]: this.props.membro.nome
		})
	}

	componentDidMount() {
		this.props.loadMatrimonio(this.props.pessoa_id)
	}

	onSuccess = data => {
		this.props.updateForm('matrimonio', data)
	}

	render = () => (
		<Fragment>
			<NotFilled
				filled={this.props.filled}
				label='matrimônio'
				actions={[
					{ title: 'Adicionar matrimônio', onClick: this.addMatrimonio },
					{ title: 'Matrimônio simplificado', onClick: this.addSimplificado },
				]}>
				<MatrimonioForm
					membro={this.membro}
					conjuge={this.conjuge}
					edit={this.props.edit}
					initialValues={this.props.initialValues}
					onSubmit={this.props.onSubmit}
				/>
			</NotFilled>
			<FormMatrimonio
				ref={this.matrimonio}
				onSubmitSuccess={this.onSuccess}
			/>
			<FormSimplificado
				ref={this.simplificado}
				onSubmitSuccess={this.onSuccess}
			/>
		</Fragment>
	)
}

let MatrimonioForm = props => (
	<form className='no-smoothState' onSubmit={props.handleSubmit}>
		<Row>
			<Col md={6}>
				<RowForm edit={props.edit}>
					<Field label='Nome de Casamento' name={props.membro} component={Campo} />
					<Field label='Nome do Cônjuge' name={props.conjuge} component={Campo} />
					<Field md={4} label='Data do Casamento' type='date' name='dt_casamento' component={Campo} formatter={date.unserialize} />
					<Field md={8} label='Local do Casamento' name='local_casamento' component={Campo} />
					<Field label='1ª Testemunha' name='testemunha1' component={Campo} />
					<Field label='2ª Testemunha' name='testemunha2' component={Campo} />
					<Field label='Celebrante' name='celebrante' component={Campo} />
					<Field md={4} label='Livro' name='livro' component={Campo} />
					<Field md={4} label='Folha' name='folha' component={Campo} />
					<Field md={4} label='Registro' name='registro' component={Campo} />
				</RowForm>
			</Col>
		</Row>
		<ActionButtons {...props} form='matrimonio' />
	</form>
)

MatrimonioForm = reduxForm({
	form: 'matrimonio-form',
	enableReinitialize: true
})(MatrimonioForm)

export default Matrimonio