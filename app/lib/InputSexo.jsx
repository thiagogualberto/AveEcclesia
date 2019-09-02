import React, { Fragment } from 'react'
import { CustomInput } from 'reactstrap'

export default ({ value, onChange, onBlur, onFocus, ...rest }) => (
	<div className='form-control'>
		<CustomInput
			{...rest}
			inline
			type='radio'
			label='Masculino'
			id={rest.name + '.m'}
			onChange={e => onChange({ target: { value: 'M' } })}
			checked={value == 'M'}
			value='M'
		/>
		<CustomInput
			{...rest}
			inline
			type='radio'
			label='Feminino'
			id={rest.name+'.f'}
			onChange={e => onChange({ target: { value: 'F' } })}
			checked={value == 'F'}
			value='F'
		/>
	</div>
)
