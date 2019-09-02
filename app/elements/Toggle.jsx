import React from 'react'
import './Toggle.css'

export default ({ value, onChange }) => (
	<div className='toggle' onClick={() => onChange(!value)}>
		{value ? <i className='fa fa-toggle-on fa-2x'></i> : <i className='fa fa-toggle-off fa-2x'></i>}
	</div>
)