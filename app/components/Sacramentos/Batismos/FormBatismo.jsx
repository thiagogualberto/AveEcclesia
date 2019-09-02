import React, { Component } from 'react'
import { Col, Row } from 'reactstrap'

import api from '../../../api'
import date from '../../../util/date'
import Campo from '../../../elements/Field'
import { FormModal } from '../../../elements/FormModal'

const defaultState = {
	id: undefined,
	catolico: 1,
	pessoa_id: [],
	nome_batismo: '',
	padrinho: '',
	madrinha: '',
	cidade: '',
	obs: '',
	outra_paroquia: 0,
	dt_batismo: '',
	paroquia: user.paroquia.nome,
	livro: '',
	folha: '',
	registro: '',
	celebrante: user.paroquia.responsavel,
	edit: false,
	saving: false
}

class FormBatismo extends Component {

	static defaultProps = {
		onFormChange: () => { },
		onSubmitError: () => { },
		onSubmitSuccess: () => { },
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
			dt_batismo: data.dt_batismo || null,
			obs: data.obs || null
		}
	}

	handleChange = ({ target }) => {
		this.setState({
			[target.name]: target.value
		});
	}

	handleSelect = ({ target }, item) => {
		this.setState({
			[target.name]: item,
			nome_batismo: item.label
		});
	}

	handleSubmit = e => {

		e.preventDefault()
		e.stopPropagation()

		const req = this.state.edit ?
			api.editData('batismo', this.data) :
			api.postData('batismo', this.data)

		req.then(({ data }) => {

			// Se tiver sucesso
			if (data.success) {

				this.props.onSubmitSuccess(data.data)
				this.addData()

				// Fecha o modal
				this.form.current.closeModal()

			} else { // Senão mostra o erro
				this.props.onSubmitError(data.message)
				this.setState({
					error: data.message,
					saving: false
				})
			}

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
			catolico: data.catolico,
			pessoa_id: { label: data.nome, value: data.pessoa_id },
			nome_batismo: data.nome_batismo,
			padrinho: data.padrinho,
			madrinha: data.madrinha,
			cidade: data.cidade,
			obs: data.obs || '',
			outra_paroquia: data.outra_paroquia,
			dt_batismo: date.serialize(data.dt_batismo),
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

	render = () => (
		<FormModal
			ref={this.form}
			onSubmit={this.handleSubmit}
			data={this.data}
			error={this.state.error}
			saving={this.state.saving}
			edit={this.state.edit}
			name='batismo'
			size='lg'
			method='post'>
			<Col md={6}>
				<h3>Dados Pessoais</h3>
				<Campo
					label='Católico?'
					name='catolico'
					type='radio'
					options={[
						{ value: 1, label: 'Sim' },
						{ value: 0, label: 'Não' }
					]}
					value={this.state.catolico}
					onChange={this.handleChange}
					required
					inline
				/>
				<Campo
					type='select'
					model='batismo/membros'
					label='Membro'
					name='pessoa_id'
					value={this.state.pessoa_id}
					format={item => ({ value: item.pessoa_id, label: item.nome })}
					onChange={this.handleSelect}
					disabled={this.state.edit}
					required
				/>
				<Campo label='Nome de batismo' name='nome_batismo' value={this.state.nome_batismo} onChange={this.handleChange} _if={this.state.catolico} required />
				<Campo label='Padrinho' name='padrinho' value={this.state.padrinho} onChange={this.handleChange} _if={this.state.catolico} required />
				<Campo label='Madrinha' name='madrinha' value={this.state.madrinha} onChange={this.handleChange} _if={this.state.catolico} required />
				<Campo label='Cidade' name='cidade' value={this.state.cidade} onChange={this.handleChange} _if={!this.state.catolico} required />
			</Col>
			<Col md={6}>
				<h3>Dados da Celebração</h3>
				<Campo
					_if={this.state.catolico}
					label='Outra Paróquia'
					name='outra_paroquia'
					type='radio'
					options={[
						{ value: 1, label: 'Sim' },
						{ value: 0, label: 'Não' }
					]}
					value={this.state.outra_paroquia}
					onChange={this.handleChange}
					required
					inline
				/>
				<Campo type='date' label='Data de batismo' name='dt_batismo' value={this.state.dt_batismo} onChange={this.handleChange} required />
				<Campo label={this.state.catolico ? 'Paróquia' : 'Igreja'} name='paroquia' value={this.state.paroquia} onChange={this.handleChange} required />
				<Row form>
					<Col md={4}>
						<Campo label='Livro' name='livro' value={this.state.livro} onChange={this.handleChange} _if={this.state.catolico} required />
					</Col>
					<Col md={4}>
						<Campo label='Folha' name='folha' value={this.state.folha} onChange={this.handleChange} _if={this.state.catolico} required />
					</Col>
					<Col md={4}>
						<Campo label='Registro' name='registro' value={this.state.registro} onChange={this.handleChange} _if={this.state.catolico} required />
					</Col>
				</Row>
				<Campo label='Celebrante' name='celebrante' value={this.state.celebrante} onChange={this.handleChange} _if={this.state.catolico} required />
			</Col>
			<Col>
				<Campo label='Observação' name='obs' type='textarea' value={this.state.obs} onChange={this.handleChange} />
			</Col>
		</FormModal>
	)
}

export default FormBatismo