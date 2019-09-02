import React from 'react'
import { CustomInput } from 'reactstrap'

const defautOptions = [
	{ label: 'Sim', value: true },
	{ label: 'Não', value: false },
]

export default ({ value, options, onChange, onBlur, onFocus, ...rest }) => {
	const array = options || defautOptions
	return (
		<div className='form-control'>
			{
				array.map(item => (
					<CustomInput
						{...rest}
						inline
						key={'key-'+item.value}
						type='radio'
						label={item.label}
						id={rest.name + '.' + item.value}
						onChange={e => onChange({ target: { value: item.value } })}
						checked={value == item.value}
						value={item.value}
					/>
				))
			}
		</div>
	)
}
