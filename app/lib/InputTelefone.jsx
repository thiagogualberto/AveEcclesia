import React from 'react'
import InputMask from 'react-input-mask'
import { Input } from 'reactstrap'

export default props => {
	const { onChange, onBlur, ...rest } = props
	return (
		<InputMask
			{...rest}
			mask='(99) 99999-9999'
			onChange={onChange}
			onBlur={() => onBlur(rest.value)}
			children={inputProps => <Input {...rest} {...inputProps} />}
		/>
	)
}
