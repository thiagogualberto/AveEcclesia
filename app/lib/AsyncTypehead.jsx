import React from 'react'
import { AsyncTypeahead } from 'react-bootstrap-typeahead'
import 'react-bootstrap-typeahead/css/Typeahead.css'
import 'react-bootstrap-typeahead/css/Typeahead-bs4.css'

import api, { handler } from '../api'

export default class extends React.Component {
	
	static defaultProps = {
		placeholder: 'Selecione...',
		format: item => ({
			label: item.nome,
			value: item.id
		})
	}

	state = {
		options: [],
		loading: false
	}

	handleSuggestions = async value => {

		this.setState({ loading: true })

		// Cancela os requests pendentes
		if (this._token) handler.cancel('New load called')

		// Define o token
		this._token = handler.token

		// Url de sugestão
		const url = `/suggestion/${this.props.model}`
		let data = []

		try {

			const resp = await api.suggestion(url, value, this._token._token, this.state.filter)
			data = resp.data

		} finally {
			this.setState({ loading: false, options: data })
		}
	}

	handleChange = value => {
		this.props.onChange({
			target: {
				name: this.props.name,
				value
			}
		})
	}

	render() {
		const { value, onChange, onBlur, disabled, ...rest } = this.props
		return (
			<AsyncTypeahead
				{...rest}
				selectHintOnEnter
				highlightOnlyResult
				minLength={3}
				options={this.state.options}
				onSearch={this.handleSuggestions}
				onChange={val => this.handleChange(val[0])}
				isLoading={this.state.loading}
				defaultInputValue={this.props.defaultText}
				searchText='Buscando sugestões...'
				emptyLabel='Nenhum registro encontrado.'
			/>
		)
	}
}
