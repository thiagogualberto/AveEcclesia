import React, { Component } from 'react'
import { CustomInput } from 'reactstrap'
import ReactSelect from 'react-select'
import AsyncSelect from 'react-select/lib/Async'
import api, { handler } from '../api'
import './Select.css'

class Select extends Component {

	static defaultProps = {
		placeholder: 'Selecione...',
		format: item => ({
			label: item.nome,
			value: item.id
		})
	}

	constructor(props) {
		super(props)
		this.state = {
			value: props.defaultValue
		}
	}

	loadOptions = async (value) => {
		try {
			if (this.props.model !== undefined) {

				// Cancela os requests pendentes
				if (this._token) handler.cancel('New load called')

				// Define o token
				this._token = handler.token

				// Busca a sugestão
				const resp = await api.suggestion(this.props.model, value, this._token._token)

				// Define se o primeiro é default
				if (this.props.defaultFirst && !this.state.value.value) {
					this.setState({ value: this.props.format(resp.data.rows[0]) })
				}

				// Retorna os dados no formato do select
				return resp.data.rows.map(this.props.format)
			}
		} catch (e) {
			console.log(e)
		}
	}

	onChange = item => {

		// Define o valor interno
		this.setState({ value: item })

		// Manda pro redux
		return this.props.onChange({
			target: {
				name: this.props.name,
				value: item.value
			}
		}, item)
	}

	noOptionsMessage = ({ inputValue }) => {
		return !inputValue ? 'Digite algo para buscar...' : 'Nenhum dado encontrado.'
	}

	renderAsync = () => (
		<AsyncSelect
			cacheOptions
			noOptionsMessage={this.noOptionsMessage}
			className='form-control'
			styles={{ control: style => ({ ...style, border: 'none', minHeight: 36 }) }}
			value={this.props.value || this.state.value}
			components={this.props.components}
			loadOptions={this.loadOptions}
			onChange={this.onChange}
			isClearable={this.props.clearable}
			isDisabled={this.props.disabled}
			placeholder={this.props.placeholder}
		/>
	)

	renderSimple = () => (
		<CustomInput
			type='select'
			id={this.props.name}
			name={this.props.name}
			value={this.props.value}
			onChange={this.props.onChange}
			required={this.props.required}
			className={this.props.className}>
			{ this.props.options.map(item => <option key={item.value} value={item.value}>{item.label}</option>) }
		</CustomInput>
	)

	renderDefault = () => (
		<ReactSelect
			{ ...this.props }
			className='form-control'
			styles={{ control: style => ({ ...style, border: 'none', minHeight: 36 }) }}
			isClearable={this.props.clearable}
			isDisabled={this.props.disabled}
			onChange={item => this.props.onChange({ target: { name: this.props.name, value: item.value } })}
		/>
	)

	render() {
		
		if (this.props.simple) {
			return this.renderSimple()
		} else if (!!this.props.model) {
			return this.renderAsync()
		}

		return this.renderDefault()
	}
}

export default Select