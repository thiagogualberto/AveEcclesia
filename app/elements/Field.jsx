import React, { PureComponent } from 'react'
import CurrencyInput from 'react-currency-input'
import InputMask from 'react-input-mask'
import { CustomInput, Input, Label, FormGroup } from 'reactstrap'
import xor from 'lodash/xor'
import './Field.css'

import Datepicker from '../elements/Datepicker'
import Select from '../elements/Select'
import Visibility from '../elements/Visibility'

class Field extends PureComponent {

	static defaultProps = {
		type: 'text',
		size: 'md',
		group: true,
		plaintext: false,
		_show: true,
		_if: true,
		formatter: value => value
	};

	get value () {
		return this.props.value !== null ? this.props.value : ''
	}

	renderSelect = () => (
		<Select
			{...this.props}
			className={`form-control form-control-${this.props.size || 'md'}`}
			name={this.props.name}
			value={this.value}
			defaultOptions={this.props.defaultOptions && [this.props.defaultOptions]}
		/>
	)

	renderDefault = () => (
		<InputMask
			id={this.props.name}
			mask={this.props.mask}
			name={this.props.name}
			type={this.props.type}
			style={{ width: this.props.width }}
			className={`form-control form-control-${this.props.size || 'md'}`}
			onChange={this.props.onChange}
			value={this.value}
			defaultValue={this.props.defaultValue}
			disabled={this.props.disabled}
			required={this.props.required}
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
			value={this.props.value}
			defaultValue={this.props.defaultValue}
			onChange={(masked, value) => this.props.onChange({ target: { value, name: this.props.name } })}
			required={this.props.required}
		/>
	)

	renderDatepicker = () => (
		<Datepicker
			id={'id_' + this.props.name}
			name={this.props.name}
			type={this.props.type}
			size={this.props.size}
			width={this.props.width}
			className='form-control'
			onChange={value => this.props.onChange({ target: { value, name: this.props.name } })}
			value={this.value}
			defaultValue={this.props.defaultValue}
			required={this.props.required}
		/>
	)

	renderTimepicker = () => (
		<InputMask
			id={this.props.name}
			mask='99:99'
			name={this.props.name}
			style={{ width: this.props.width }}
			className={`form-control form-control-${this.props.size || 'md'}`}
			onChange={this.props.onChange}
			value={this.value}
			defaultValue={this.props.defaultValue}
			disabled={this.props.disabled}
			required={this.props.required}
		/>
	)

	renderTextarea = () => (
		<textarea
			id={this.props.name}
			name={this.props.name}
			value={this.props.value}
			style={{ width: this.props.width }}
			className={`form-control form-control-${this.props.size || 'md'}`}
			onChange={this.props.onChange}
			required={this.props.required}
		// cols="30"
		// rows="10"
		/>
	)

	renderCheck = (callback) => (
		<div className={`form-control form-control-${this.props.size || 'md'}`}>
			{ this.props.options && this.props.options.map(callback) }
		</div>
	)

	renderCheckMulti = (callback) => (
		<div>
			{ this.props.options && this.props.options.map(callback) }
		</div>
	)

	renderRadio = item => (
		<CustomInput
			type='radio'
			key={item.value}
			label={item.label}
			name={this.props.name}
			inline={this.props.inline}
			id={this.props.name + '_' + item.value}
			checked={this.props.value == item.value}
			onChange={() => this.props.onChange({ target: { value: item.value, name: this.props.name } })}
		/>
	)

	renderCheckbox = (item, index) => {

		const values = !!this.props.value ? this.props.value.split(',') : []
		const value = (index + 1).toString()
		const checked = ~values.indexOf(value)
		const toogle = xor(values, [value]).sort()

		return (
			<CustomInput
				type='checkbox'
				key={item.value}
				label={item.label}
				id={`${this.props.name}.${value}`}
				name={`${this.props.name}.${value}`}
				checked={checked}
				inline={this.props.inline}
				onChange={() => this.props.onChange({
					target: {
						value: toogle.join(','),
						name: this.props.name
					}
				})}
			/>
		)
	}

	renderStatic = () => (
		<input className='form-control' value={this.props.value} readOnly />
	)

	renderPlaintext = () => {
		const value = this.props.value
		return (
			<Input plaintext tag='p'>
				{ value === '' || value === null ? '-' : this.props.formatter(value) }
			</Input>
		)
	}

	renderField = () => {

		if (this.props.plaintext) {
			return this.renderPlaintext()
		}

		switch (this.props.type) {
			case 'time': return this.renderTimepicker()
			case 'date': return this.renderDatepicker()
			case 'radio': return this.renderCheck(this.renderRadio)
			case 'checkbox': return this.renderCheck(this.renderCheckbox)
			case 'checkbox-multi': return this.renderCheckMulti(this.renderCheckbox)
			case 'select': return this.renderSelect()
			case 'currency': return this.renderCurrency()
			case 'textarea': return this.renderTextarea()
			case 'static': return this.renderStatic()
			default: return this.renderDefault()
		}
	}

	render() {
		const { _if, _show, group } = this.props
		if (group) {
			return (
				!!_if &&
				<FormGroup className={this.props.className} style={{ display: !!_show ? 'block' : 'none' }}>
					<Visibility visible={!!this.props.label}>
						<Label htmlFor={'id_' + this.props.name}>
							{this.props.label}
							{this.props.required && <span className='text-danger'> *</span>}
						</Label>
					</Visibility>
					{this.renderField()}
				</FormGroup>
			);
		} else {
			return this.renderField()
		}
	}
}

export default Field