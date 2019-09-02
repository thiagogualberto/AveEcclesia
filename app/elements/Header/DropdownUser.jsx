import React from 'react'
import { Link } from 'react-router-dom'
import { UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap'

export default () => (
	<UncontrolledDropdown nav inNavbar>
		<DropdownToggle nav caret>
			<i className='fa fa-user' /> { user.paroquia.nome || user.nome }
		</DropdownToggle>
		<DropdownMenu right>
			<DropdownItem tag={Link} to='/perfil'><i className='fa fa-user' /> Perfil</DropdownItem>
			{/* <DropdownItem tag={Link} to='/settings'><i className='fa fa-gear' /> Configurações</DropdownItem> */}
			<DropdownItem divider />
			<DropdownItem tag='a' href={mounturl+'/auth/logout'}><i className='fa fa-sign-out' /> Sair</DropdownItem>
		</DropdownMenu>
	</UncontrolledDropdown>
)