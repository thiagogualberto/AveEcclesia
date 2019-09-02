import React from 'react'
import { Col, CustomInput } from 'reactstrap'

export default props => (
	<Col>
		{props.options.map(option => (
			<CustomInput
				type='radio'
				id={option.value}
				key={option.value}
				name={props.name}
				label={option.label}
				value={option.value}
				required={props.required}
				onChange={props.onChange}
				className='mb-2'
				placeholder={props.placeholder} />
		))}
	</Col>
)