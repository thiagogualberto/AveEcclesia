import React, { PureComponent } from 'react'
import CurrencyInput from 'react-currency-input'
import InputMask from 'react-input-mask'
import { connect } from 'react-redux'

import Select from './Select';
import Datepicker from './Datepicker';
import { changeField } from '../actions/transacoesAction'

class Campo extends PureComponent {

	static defaultProps = {
		type: 'text'
	};

	get value() {
		return this.props.edit[this.props.name] || this.props.defaultValue
	}

	handleChange = (e) => {
		this.props.changeField(this.props.name, e.target.value)
	}

	componentWillMount() {
		if (this.props.edit.id == 0 && !!this.props.defaultValue && this.props.type !== 'select') {
			this.props.changeField(this.props.name, this.props.defaultValue)
		}
	}

	renderSelect = () => (
		<Select
			id={this.props.name}
			name={this.props.name}
			model={this.props.model}
			format={this.props.format}
			onChange={this.handleChange}
			defaultValue={this.props.defaultValue}
			defaultFirst={this.props.defaultFirst}
			defaultOptions={this.props.defaultOptions && [this.props.defaultOptions]}
		/>
	)

	renderDefault = () => (
		<InputMask
			id={this.props.name}
			mask={this.props.mask}
			name={this.props.name}
			style={{width: this.props.width}}
			className={`form-control form-control-${this.props.size || 'md'}`}
			onChange={this.handleChange}
			value={this.value ||  ''}
		/>
	)

	renderCurrency = () => (
		<CurrencyInput
			id={this.props.name}
			name={this.props.name}
			decimalSeparator=','
			thousandSeparator='.'
			prefix='R$ '
			style={{ width: this.props.width }}
			className={`form-control form-control-${this.props.size || 'md'}`}
			value={this.value}
			defaultValue={this.props.defaultValue}
			onChange={(masked, value) => this.props.changeField(this.props.name, value)}
		/>
	)

	renderDatepicker = () => (
		<Datepicker
			id={this.props.name}
			name={this.props.name}
			size={this.props.size}
			width={this.props.width}
			className='form-control'
			onChange={value => this.handleChange({ target: { value, name: this.props.name } })}
			value={this.value}
		/>
	)

	renderTextarea = () => (
		<textarea
			id={this.props.name}
			name={this.props.name}
			value={this.value}
			style={{ width: this.props.width }}
			className={`form-control form-control-${this.props.size || 'md'}`}
			onChange={this.handleChange}
			// cols="30"
			// rows="10"
		/>
	)

	renderField = () => {
		switch (this.props.type) {
			case 'date': return this.renderDatepicker()
			case 'select': return this.renderSelect()
			case 'currency': return this.renderCurrency()
			case 'textarea': return this.renderTextarea()
			default: return this.renderDefault()
		}
	}

	render() {
		return (
			<div className='form-group'>
				<Label title={this.props.title} name={this.props.name} />
				{ this.renderField() }
			</div>
		);
	}
}

const Label = props => !!props.title && (
	<label htmlFor={props.name}>{props.title}</label>
)

const mapStateToProps = state => ({
	edit: state.transacoes.edit
})

export default connect(mapStateToProps, { changeField })(Campo)