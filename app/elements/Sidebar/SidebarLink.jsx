import React from 'react'
import { NavLink } from 'react-router-dom'
// import { NavLink } from 'reactstrap'

export default props => (
	<NavLink {...props} className='nav-link no-smoothState' activeClassName='active' to={(props.baseurl || '') + props.to}>
		{props.text}
	</NavLink>
)
