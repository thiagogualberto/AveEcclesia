import React from 'react'
import CurrencyInput from 'react-currency-input'

export default props => {
	const { size, onChange, onBlur, ...rest } = props
	return (
		<CurrencyInput
			{...rest}
			decimalSeparator=','
			thousandSeparator='.'
			prefix='R$ '
			className={`form-control form-control-${size || 'md'}`}
			onBlur={() => onBlur(rest.value)}
			onChangeEvent={(e, masked, value) => onChange({ target: { value } })}
		/>
	)
}
