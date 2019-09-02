import React from 'react'
import Icon from './Icon'

export default (props) => (
	<button
		id={props.id}
		type='button'
		className={`btn btn-${props.type || 'primary'} btn-${props.size || 'md'} ${props.className || ''}`}
		onClick={props.onClick}
		style={{ color: props.color }}
		disabled={props.disabled}>

		<Icon name={props.icon} size={props.iconSize} color={props.iconColor} /> {props.title}

	</button>
)