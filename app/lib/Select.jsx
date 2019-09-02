import React from 'react'
import Select from 'react-select'

export default props => {
	const { value, defaultValue, options, onChange, onBlur, disabled } = props
	return (
		<Select
			{...props}
			className='form-control'
			styles={{ control: style => ({ ...style, border: 'none', minHeight: 36 }) }}
			onChange={item => onChange({ target: { name: name, value: item.value } })}
			value={normalizeValue(value, options)}
			defaultValue={normalizeValue(defaultValue, options)}
			onBlur={() => onBlur(value)}
			isDisabled={disabled}
			placeholder={props.placeholder || 'Selecione...'}
			noOptionsMessage={() => 'Nada encontrado'}
		/>
	)
}

function normalizeValue(value, options) {
		return options.find(item => item.value === value)
}
