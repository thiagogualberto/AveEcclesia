import React, { Component, Fragment } from 'react'
import { Col } from 'reactstrap'

import api from '../../../api'
import date from '../../../util/date'
import Visibility from '../../../elements/Visibility'
import { FormModal, Campo } from '../../../elements/FormModal'

class FormDizimista extends Component {

	state = {
		pessoa_id: '',
		comunidade_id: '',
		inicio: date.serialize(),
		dt_conjuge: '',
		dt_casamento: '',
		conjuge: '',
		edit: false,
	}

	constructor(props) {
		super(props)
		window.editData = this.editData
		window.addDizimista = this.addData
	}

	get data() {
		return {
			id: this.state.id,
			pessoa_id: this.state.pessoa_id,
			comunidade_id: this.state.comunidade_id,
			inicio: this.state.inicio,
			dt_conjuge: this.state.dt_conjuge || null,
			dt_casamento: this.state.dt_casamento || null,
			conjuge: this.state.conjuge || null,
		}
	}

	handleChange = ({ target }) => {
		this.setState({
			[target.name]: target.value
		});
	}

	handleSubmit = e => {

		e.preventDefault()
		e.stopPropagation()

		const req = this.state.edit ?
			api.editData('dizimista', this.data) :
			api.postData('dizimista', this.data)

		req.then(({data}) => {

			// Se tiver sucesso
			if (data.success) {
				this.setState({
					id: undefined,
					pessoa_id: '',
					comunidade_id: '',
					inicio: date.serialize(),
					dt_conjuge: '',
					dt_casamento: '',
					conjuge: '',
					saving: false,
					edit: false
				})
				$('#modal_dizimista').modal('hide')
				this.props.onSubmitSuccess(data)

			} else { // Senão mostra o erro
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
		$('#modal_dizimista').modal('show')
		this.setState({
			id: data.id,
			nome: data.nome,
			pessoa_id: data.pessoa_id,
			comunidade_id: data.comunidade_id,
			comunidade_nome: data.comunidade_nome,
			inicio: data.inicio ? date.serialize(data.inicio) : date.serialize(),
			dt_conjuge: data.dt_conjuge ? date.serialize(data.dt_conjuge) : '',
			dt_casamento: data.dt_casamento ? date.serialize(data.dt_casamento) : '',
			conjuge: data.conjuge || '',
			edit: true
		})
	}

	addData = data => {
		$('#modal_dizimista').modal('show')
		this.setState({
			id: null,
			nome: '',
			pessoa_id: '',
			comunidade_id: '',
			comunidade_nome: '',
			inicio: date.serialize(),
			dt_conjuge: '',
			dt_casamento: '',
			conjuge: '',
			edit: false,
			...data
		})
	}

	render() {
		return (
			<FormModal
				name='dizimista'
				edit={this.state.edit}
				onSubmit={this.handleSubmit}
				data={this.data}
				error={this.state.error}
				saving={this.state.saving}
				method='post'>
				<Visibility visible={!this.state.edit}>
					<Campo
						type='select'
						model='dizimista/membros'
						label='Membro'
						name='pessoa_id'
						value={this.state.pessoa_id ? { value: this.state.pessoa_id, label: this.state.nome } : []}
						onChange={(e, item) => this.setState({ pessoa_id: item.value, nome: item.label })}
						format={item => ({ value: item.pessoa_id, label: item.nome })}
						disabled={this.state.edit}
						required
					/>
				</Visibility>
				<Visibility visible={this.state.edit}>
					<Campo label='Membro' value={this.state.nome} disabled readOnly />
				</Visibility>
				<Campo
					type='select'
					model='comunidade?ativo=1'
					label='Comunidade'
					name='comunidade_id'
					value={this.state.comunidade_id ? { value: this.state.comunidade_id, label: this.state.comunidade_nome } : []}
					onChange={(e, item) => this.setState({ comunidade_id: item.value, comunidade_nome: item.label })}
					required
				/>
				<Campo type='date' md={6} label='Início' name='inicio' defaultValue={this.state.inicio} onChange={this.handleChange} required />
				<Campo type='date' md={6} label='Nascimento cônjuge' name='dt_conjuge' defaultValue={this.state.dt_conjuge} onChange={this.handleChange} />
				<Campo type='date' label='Data de casamento' name='dt_casamento' defaultValue={this.state.dt_casamento} onChange={this.handleChange} />
				<Campo label='Cônjuge' name='conjuge' value={this.state.conjuge} onChange={this.handleChange} />
			</FormModal>
		)
	}
}

export default FormDizimista
