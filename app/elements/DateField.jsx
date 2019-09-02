import React from 'react'
import { Col, Label, FormGroup } from 'reactstrap'
import Datepicker from './Datepicker'

export default props => (
	<Col>
		<FormGroup>
			<Label for={props.name}>
				{props.label}
				{props.required && <span className='text-danger'> *</span>}
			</Label>
			<Datepicker
				id={props.name}
				type={props.type}
				name={props.name}
				value={props.value}
				required={props.required}
				onChange={val => props.onChange({ target: { name: props.name, value: val } })}
				placeholder={props.placeholder}
				required={props.required} />
		</FormGroup>
	</Col>
)
