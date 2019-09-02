import React from 'react'
import { NavItem } from 'reactstrap'

import SidebarLink from './SidebarLink'
import SidebarCollapse from './SidebarCollapse'

const SidebarItem = props => {

	const { permissao } = props

	// Caso tenha permissões
	if (props.permissao && !user[permissao]) {
		return null
	}

	return (
		<NavItem>
			{
				props.children === undefined ?
					<SidebarLink {...props} /> :
					<SidebarCollapse {...props} />
			}
		</NavItem>
	)
}

export default SidebarItem
