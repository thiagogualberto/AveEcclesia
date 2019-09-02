import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Nav, Navbar, NavItem, NavbarBrand, NavbarToggler, Collapse } from 'reactstrap'

import HeaderPortal from './HeaderPortal'
import DropdownUser from './DropdownUser'
import DropdownNotification from './DropdownNotification'

export default () => {

	const [navbarOpen, setNavbar] = useState(false)
	const toggle = () => setNavbar(!navbarOpen)

	return (
		<HeaderPortal>
			<Navbar color='white' light fixed='top' expand='md'>
				<NavbarToggler onClick={toggle} />
				<NavbarBrand tag={Link} to='/'>
					<img src={mounturl + '/img/icone.png'} alt='Logo Ave Ecclesia' />
				</NavbarBrand>
				<Collapse isOpen={navbarOpen} navbar>
					<Nav className='ml-auto' navbar>
						<DropdownNotification />
						<DropdownUser />
					</Nav>
				</Collapse>
			</Navbar>
		</HeaderPortal>
	)
}
