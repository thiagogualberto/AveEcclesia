import React, { Component, Fragment } from 'react'
import { Nav } from 'reactstrap'

import SidebarPortal from './SidebarPortal'
import SidebarItem from './SidebarItem';

class Sidebar extends Component {

	constructor(props) {
		super(props)
		this.state = {
			menuOpen: ''
		}
	}

	// Faz o controle para ter apenas um menu aberto
	toggle = menuOpen => {
		this.setState({
			menuOpen: menuOpen !== this.state.menuOpen ? menuOpen : ''
		})
	}

	render () {
		const { menuOpen } = this.state
		return (
			<SidebarPortal>
				<Nav className='nav-pills'>
					<SidebarItem to='/paroquia' text='Paróquia' />
					<SidebarItem base='/cadastro' text='Cadastro' menuOpen={menuOpen} toggle={this.toggle}>
						<SidebarItem to='/membros' text='Membros' />
						<SidebarItem to='/agentes' text='Agentes' />
						<SidebarItem to='/comunidades' text='Comunidades' />
						<SidebarItem to='/prestadores' text='Prestadores de serviço' />
						<SidebarItem to='/funcionarios' text='Funcionários' />
						<SidebarItem to='/paroquias' text='Paróquias' permissao='cad_paroquias' />
						<SidebarItem to='/usuarios' text='Usuários' permissao='cad_usuarios' />
					</SidebarItem>
					<SidebarItem base='/sacramentos' text='Sacramentos' menuOpen={menuOpen} toggle={this.toggle}>
						<SidebarItem to='/batismo' text='Batismo' />
						<SidebarItem to='/crisma' text='Crisma' />
						<SidebarItem to='/matrimonio' text='Matrimônio' />
					</SidebarItem>
					<SidebarItem base='/dizimo' text='Dízimo' menuOpen={menuOpen} toggle={this.toggle}>
						<SidebarItem to='/dizimistas' text='Dizimistas' />
						<SidebarItem to='/dizimos' text='Devoluções' />
					</SidebarItem>
					<SidebarItem base='/financeiro' text='Financeiro' menuOpen={menuOpen} toggle={this.toggle}>
						<SidebarItem to='/movimentacoes' text='Movimentações' />
						<SidebarItem to='/contas' text='Contas' />
					</SidebarItem>
					<SidebarItem base='/relatorios' text='Relatórios' menuOpen={menuOpen} toggle={this.toggle}>
						<SidebarItem to='/finance' text='Financeiro' />
						<SidebarItem to='/membros' text='Membros' />
						<SidebarItem to='/agentes' text='Agentes' />
						<SidebarItem to='/devolucao' text='Dízimos' />
					</SidebarItem>
				</Nav>
			</SidebarPortal>
		)
	}
}

export default Sidebar
