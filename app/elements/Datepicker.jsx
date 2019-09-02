import React, { Component } from 'react'
import moment from 'moment'
import './Datepicker.css'

import date from '../util/date'

class Datepicker extends Component {

	static defaultProps = {
		type: 'date',
		locale: 'pt-br',
		mask: '99/99/9999',
		format: 'dd/mm/yyyy',
		uiLibrary: 'bootstrap4'
	}

	get size () {
		switch (this.props.size) {
			case 'sm': return 'small'
			case 'lg': return 'large'		
			default: return 'default'
		}
	}

	get format () {
		return this.props.format.toUpperCase()
	}

	formatValue(value, format) {
		return !!value ? moment(value).format(format) : ''
	}

	handleChange = ({ target }) => {
		this.props.onChange(
			moment(target.value, 'DD/MM/YYYY').format('YYYY-MM-DD'),
			target.value
		)
	}

	render () {
		return (
			<input
				id={this.props.id}
				ref={el => this.el = el}
				name={this.props.name}
				style={this.props.style}
				required={this.props.required}
				className={this.props.className}
			/>
		)
	}

	componentDidUpdate(prevProps) {
		if (prevProps.value != this.props.value) {
			if (this.props.type == 'date') {
				this.$elem.value(!!this.props.value ? date.unserialize(this.props.value) : '')
			} else {
				this.$elem.value(this.props.value)
			}
		}
	}

	componentWillUnmount() {
		this.$elem.destroy()
	}

	componentDidMount() {

		// Declara as opções
		const options = {
			size: this.size,
			width: this.props.width,
			locale: this.props.locale,
			uiLibrary: this.props.uiLibrary,
		}
	
		// Declara o elemento jQuery
		const $el = $(this.el)

		if (this.props.type == 'date')
		{
			const value = this.props.value || this.props.defaultValue

			$el.mask(this.props.mask)
			$el.attr('pattern', '\\d{2}/((0\\d)|(1[0-2]))/\\d{4}')
			this.$elem = $el.datepicker({
				...options,
				value: !!value ? date.unserialize(value) : '',
				format: 'dd/mm/yyyy',
				change: this.handleChange
			})
		}
		else
		{
			$el.mask('99:99')
			this.$elem = $el.timepicker({
				...options,
				modal: false,
				// header: false,
				mode: '24hr',
				value: this.props.value || this.props.defaultValue,
				footer: false,
				change: e => this.props.onChange(e.target.value)
			})
		}
	}
}

export default Datepicker