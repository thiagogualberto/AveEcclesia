import React, { Component } from 'react'
import { Col, Row } from 'reactstrap'

import api from '../../../api'
import date from '../../../util/date'
import Campo from '../../../elements/Field'
import { FormModal } from '../../../elements/FormModal'

const defaultState = {
	id: undefined,
	pessoa_id: [],
	padrinho: '',
	madrinha: '',
	dt_crisma: '',
	paroquia: user.paroquia.nome,
	livro: '',
	folha: '',
	registro: '',
	celebrante: '',
	edit: false,
	saving: false
}

class FormCrisma extends Component {

	static defaultProps = {
		onFormChange: () => {},
		onSubmitError: () => {},
		onSubmitSuccess: () => {},
	}

	constructor(props) {
		super(props)
		this.form = React.createRef()
		this.state = defaultState
	}

	get data() {
		const { edit, saving, error, nome, mae, pai, ...data } = this.state
		return {
			...data,
			pessoa_id: data.pessoa_id.value,
			dt_crisma: data.dt_crisma || null,
		}
	}

	handleChange = ({ target }) => {
		this.setState({
			[target.name]: target.value
		});
	}

	handleSelect = ({ target }, item) => {
		this.setState({
			[target.name]: item
		});
	}

	handleSubmit = e => {

		e.preventDefault()
		e.stopPropagation()

		const req = this.state.edit ?
			api.editData('crisma', this.data) :
			api.postData('crisma', this.data)

		req.then(({ data }) => {

			// Se tiver sucesso
			if (data.success)
			{
				this.props.onSubmitSuccess(data.data)
				this.addData()
			}
			else // Senão mostra o erro
			{
				this.props.onSubmitError(data.message)
				this.setState({
					error: data.message,
					saving: false
				})
			}

			// Fecha o modal
			this.form.current.closeModal()
		})

		this.setState({
			error: undefined,
			saving: true
		})
	}

	editData = data => {
		this.form.current.openModal()
		this.setState({
			id: data.id,
			pessoa_id: { label: data.nome, value: data.pessoa_id },
			padrinho: data.padrinho,
			madrinha: data.madrinha,
			dt_crisma: date.serialize(data.dt_crisma),
			paroquia: data.paroquia,
			livro: data.livro,
			folha: data.folha,
			registro: data.registro,
			celebrante: data.celebrante,
			edit: true,
			error: false,
			saving: false
		})
	}

	addData = data => {
		this.form.current.openModal()
		this.setState({ ...defaultState, ...data })
	}

	render() {
		return (
			<FormModal
				ref={this.form}
				edit={this.state.edit} name='crisma' size='lg'
				onSubmit={this.handleSubmit}
				data={this.data}
				error={this.state.error}
				saving={this.state.saving}
				method='post'>
				<Col>
					<h3>Dados Pessoais</h3>
						<Campo
							type='select'
							model='crisma/membros'
							label='Membro'
							name='pessoa_id'
							value={this.state.pessoa_id}
							format={item => ({ value: item.pessoa_id, label: item.nome })}
							onChange={this.handleSelect}
							disabled={this.state.edit}
							required
						/>
						<Campo label='Padrinho' name='padrinho' value={this.state.padrinho} onChange={this.handleChange} _if={this.state.catolico} />
						<Campo label='Madrinha' name='madrinha' value={this.state.madrinha} onChange={this.handleChange} _if={this.state.catolico} />
				</Col>
				<Col>
					<h3>Dados da Celebração</h3>
						<Campo type='date' label='Data de crisma' name='dt_crisma' value={this.state.dt_crisma} onChange={this.handleChange} required />
						<Campo label='Paróquia' name='paroquia' value={this.state.paroquia} onChange={this.handleChange} required />
						<Row>
							<Col md={4}>
								<Campo label='Livro' name='livro' value={this.state.livro} onChange={this.handleChange} _if={this.state.catolico} required />
							</Col>
							<Col md={4}>
								<Campo md={4} label='Folha' name='folha' value={this.state.folha} onChange={this.handleChange} _if={this.state.catolico} required />
							</Col>
							<Col md={4}>
								<Campo label='Registro' name='registro' value={this.state.registro} onChange={this.handleChange} _if={this.state.catolico} required />
							</Col>
						</Row>
						<Campo label='Celebrante' name='celebrante' value={this.state.celebrante} onChange={this.handleChange} _if={this.state.catolico} required />
				</Col>
			</FormModal>
		)
	}
}

export default FormCrisma