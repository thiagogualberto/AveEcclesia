import React from 'react'
import InputMask from 'react-input-mask'
import { Input } from 'reactstrap'

export default props => {
	const { mask, value, onChange, onFocus, onBlur, type, disabled, ...rest } = props
	return (
		<InputMask mask={mask} value={value} onChange={onChange} onFocus={onFocus} onBlur={onBlur} disabled={disabled}>
			{ inputProps => <Input {...rest} {...inputProps} /> }
		</InputMask>
	)
}
