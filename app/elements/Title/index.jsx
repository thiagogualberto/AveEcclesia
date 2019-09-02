import React from 'react'
import { ButtonToolbar } from 'reactstrap'

const Title = props => (
	<div className='d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom'>
		<h1 className='h2'>
			{props.children} <small className='text-muted'>{props.subtitle}</small>
		</h1>
		<ButtonToolbar className='mb-2 mb-md-0'>
			{ props.renderToolbar() }
		</ButtonToolbar>
	</div>
)

Title.defaultProps = {
	renderToolbar: () => { }
}

export default Title