import React, { Component } from 'react'
import { Row, Col } from 'reactstrap'

import api from '../../../api'
import date from '../../../util/date'
import { Campo, FormModal } from '../../../elements/FormModal'

const defaultState = {
	id: null,
	noivo_id: [],
	noiva_id: [],
	noivo_nome: '',
	noiva_nome: '',
	dt_casamento: '',
	hr_casamento: '',
	local_casamento: user.paroquia.nome,
	celebrante: user.paroquia.responsavel,
	testemunha1: '',
	testemunha2: '',
	livro: '',
	folha: '',
	registro: '',
	menor: true,
	autorizacao: true,
	casado: true,
	edit: false,
	saving: false
}

class FormSimplificado extends Component {

	static defaultProps = {
		onFormChange: () => { }
	}

	constructor(props) {
		super(props)
		this.form = React.createRef()
		this.state = defaultState
		window.addSimplificado = this.addData
	}

	get data() {
		const { edit, error, saving, noivo_pai, noiva_pai, noivo_mae, noiva_mae, ...data } = this.state
		return {
			...data,
			noivo_id: data.noivo_id.value,
			noiva_id: data.noiva_id.value,
			dt_casamento: !!data.dt_casamento ? date.serialize(data.dt_casamento) : null
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
			[target.name.replace('id', 'nome')]: item.label
		});
	}

	handleSubmit = (e) => {

		e.preventDefault()
		e.stopPropagation()

		const req = this.state.edit ?
			api.editData('matrimonio', this.data) :
			api.postData('matrimonio', this.data)

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

	addData = data => {
		this.form.current.openModal()
		this.setState({ ...defaultState, ...data })
	}

	render() {
		return (
			<FormModal
				ref={this.form}
				row={false}
				onSubmit={this.handleSubmit}
				data={this.data}
				error={this.state.error}
				saving={this.state.saving}
				name='simplificado'
				title='Matrimônio Simplificado'
				size='lg'
				method='post'>
				<Row>
					<Campo
						md={6}
						_if={!this.state.edit}
						type='select'
						model='matrimonio/membros?sexo=M'
						label='Noivo'
						name='noivo_id'
						placeholder='Selecione um membro...'
						value={this.state.noivo_id}
						format={item => ({ value: item.pessoa_id, label: item.nome })}
						onChange={this.handleSelect}
						disabled={this.state.edit}
						required
					/>
					<Campo
						md={6}
						_if={!this.state.edit}
						type='select'
						model='matrimonio/membros?sexo=F'
						label='Noiva'
						name='noiva_id'
						placeholder='Selecione um membro...'
						value={this.state.noiva_id}
						format={item => ({ value: item.pessoa_id, label: item.nome })}
						onChange={this.handleSelect}
						disabled={this.state.edit}
						required
					/>
					<Campo md={6} label='Nome de casamento (noivo)' name='noivo_nome' value={this.state.noivo_nome} onChange={this.handleChange} required />
					<Campo md={6} label='Nome de casamento (noiva)' name='noiva_nome' value={this.state.noiva_nome} onChange={this.handleChange} required />
				</Row>
				<hr/>
				<Row>
					<Col>
						<Row>
							<Campo md={6} label='Data do casamento' name='dt_casamento' type='date' value={this.state.dt_casamento} onChange={this.handleChange} required />
							<Campo md={6} label='Hora do casamento' name='hr_casamento' type='time' value={this.state.hr_casamento} onChange={this.handleChange} required />
							<Campo label='Local do casamento' name='local_casamento' value={this.state.local_casamento} onChange={this.handleChange} required />
							<Campo label='Celebrante' name='celebrante' value={this.state.celebrante} onChange={this.handleChange} required />
						</Row>
					</Col>
					<Col>
						<Row>
							<Campo md={4} label='Livro' name='livro' value={this.state.livro} onChange={this.handleChange} _if={this.state.catolico} required />
							<Campo md={4} label='Folha' name='folha' value={this.state.folha} onChange={this.handleChange} _if={this.state.catolico} required />
							<Campo md={4} label='Registro' name='registro' value={this.state.registro} onChange={this.handleChange} _if={this.state.catolico} required />
							<Campo label='Testemunha 1' name='testemunha1' value={this.state.testemunha1} onChange={this.handleChange} required />
							<Campo label='Testemunha 2' name='testemunha2' value={this.state.testemunha2} onChange={this.handleChange} required />
						</Row>
					</Col>
				</Row>
			</FormModal>
		)
	}
}

export default FormSimplificado
