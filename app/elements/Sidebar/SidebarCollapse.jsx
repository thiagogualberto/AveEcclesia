import React, { Fragment } from 'react'
import { Route } from 'react-router-dom'
import { Nav, NavLink, Collapse } from 'reactstrap'

export default props => (
	<Route path={props.base}>
		{ ({ match }) => {
			const { menuOpen, base, toggle, text, children, ...rest } = props
			const active = (menuOpen === base) || (menuOpen === '' && !!match)
			const collapsed = active ? '' : ' collapsed'
			return (
				<Fragment>
					<NavLink {...rest} className={'no-smoothState collapse-link' + collapsed} onClick={() => toggle(base)} href='#'>
						{text}
					</NavLink>
					<Collapse isOpen={active}>
						<Nav>
							{
								React.Children.map(children, child => (
									React.cloneElement(child, { baseurl: base })
								))
							}
						</Nav>
					</Collapse>
				</Fragment>
			)
		}}
	</Route>
)
