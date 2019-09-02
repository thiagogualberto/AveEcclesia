import React from 'react'
import './RowStatusIcon.css'

export default props => (
	<div className={`status-icon text-center text-light float-right bg-${props.check ? 'success' : 'danger'}`}>
		<i className={`fa fa-${props.check ? 'check' : 'exclamation'}`} />
	</div>
)