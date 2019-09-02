import React from 'react'
import AsyncSelect from 'react-select/lib/Async'

import api, { handler } from '../api'

export default class extends React.Component {
	
	static defaultProps = {
		placeholder: 'Selecione...',
		onFormat: item => ({
			label: item.nome,
			value: item.id
		})
	}

	state = {
		label: ''
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
				// if (this.props.defaultFirst && !this.state.value.value) {
				// 	this.setState({ value: this.props.format(resp.data.rows[0]) })
				// }
	
				// Retorna os dados no formato do select
				return resp.data.rows.map(this.props.onFormat)
			}
		} catch (e) {
			console.log(e)
		}
	}

	handleChange = item => {
		this.setState({ label: item.label })
		this.props.onChange({ target: {  value: item.value } })
	}

	render() {
		const { value, onChange, onFormat, onBlur, disabled, defaultOptions, defaultText, ...rest } = this.props
		const { label } = this.state
		const defaultValue = !!value ? { value: value, label: label || defaultText } : ''
		return (
			<AsyncSelect
				{...rest}
				onChange={this.handleChange}
				onBlur={() => onBlur(value)}
				loadOptions={this.loadOptions}
				isDisabled={disabled}
				value={defaultValue}
				format={onFormat}
				className='form-control'
				styles={{ control: style => ({ ...style, border: 'none', minHeight: 36 }) }}
				defaultOptions={defaultOptions || !!defaultText && [defaultValue]}
				defaultInputValue={defaultText}
				noOptionsMessage={() => 'Nada encontrado'}
			/>
		)
	}
}
