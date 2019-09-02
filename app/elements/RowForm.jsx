import React from 'react'

export default props => (
	<div className='form-row'>
		{
			React.Children.map(
				props.children,
				child => React.cloneElement(child, { plaintext: !props.edit })
			)
		}
	</div>
)