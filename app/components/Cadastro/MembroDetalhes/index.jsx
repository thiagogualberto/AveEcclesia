import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Switch } from 'react-router-dom'
import './MembroDetalhes.css'

import { loadMembro } from '../../../actions/membroAction'
import { Tab, Tabs, TabContentCard } from '../../../elements/Tabs'
import _DadosMembro from './DadosMembro'
import _Matrimonio from './Matrimonio'
import _Batismo from './Batismo'
import _Dizimista from './Dizimista'
import _Crisma from './Crisma'
import Container from '../../../elements/Container';
import { withRouteAndProps } from './util'
import {
	updateMembro,
	loadDizimista,
	loadBatismo,
	loadCrisma,
	loadMatrimonio,
	updateForm
} from '../../../actions/membroAction'

const DadosMembro = withRouteAndProps(_DadosMembro, 'membro')
const Dizimista = withRouteAndProps(_Dizimista, 'dizimista', { loadDizimista, updateForm })
const Batismo = withRouteAndProps(_Batismo, 'batismo', { loadBatismo, updateForm })
const Crisma = withRouteAndProps(_Crisma, 'crisma', { loadCrisma, updateForm })
const Matrimonio = withRouteAndProps(_Matrimonio, 'matrimonio', { loadMatrimonio, updateForm })

class MembroDetalhes extends Component {

	get activeTab() {
		switch (this.props.match.params.form) {
			case '': return 1
			case 'dizimista': return 2
			case 'batismo': return 3	
			case 'crisma': return 4
			case 'matrimonio': return 5
			default: return 1
		}
	}

	componentWillUnmount() {
		console.log('unmount')
	}

	updateMembro = (path, data, id) => {
		return this.props.updateMembro(path, data, id)
	}

	componentDidMount() {
		this.props.loadMembro(this.props.match.params.id)
	}

	render () {
		const pessoa_id = this.props.match.params.id
		const baseurl = '/cadastro/membros/' + pessoa_id
		return (
			<Container className='MembroDetalhes' title='Membro' subtitle={this.props.nome}>
				<Tabs activeTab={this.activeTab}>
					<Tab href={baseurl}>Dados do Membro</Tab>
					<TabInfo href={baseurl + '/dizimista'} has={this.props.ie_dizimista}>Dizimista</TabInfo>
					<TabInfo href={baseurl + '/batismo'} has={this.props.ie_batismo}>Batismo</TabInfo>
					<TabInfo href={baseurl + '/crisma'} has={this.props.ie_crisma}>Crisma</TabInfo>
					<TabInfo href={baseurl + '/matrimonio'} has={this.props.ie_matrimonio}>Matrimônio</TabInfo>
				</Tabs>
				<TabContentCard className='card'>
					<Switch>
						<DadosMembro
							exact path='/cadastro/membros/:id'
							onSubmit={data => this.updateMembro('membros', data, data.pessoa_id)}
						/>
						<Dizimista
							path='/cadastro/membros/:id/dizimista'
							onSubmit={data => this.updateMembro('dizimista', data)}
						/>
						<Batismo
							path='/cadastro/membros/:id/batismo'
							onSubmit={data => this.updateMembro('batismo', data)}
						/>
						<Crisma
							path='/cadastro/membros/:id/crisma'
							onSubmit={data => this.updateMembro('crisma', data)}
						/>
						<Matrimonio
							path='/cadastro/membros/:id/matrimonio'
							onSubmit={data => this.updateMembro('matrimonio', data)}
						/>
					</Switch>
				</TabContentCard>
			</Container>
		)
	}
}

const TabInfo = props => <Tab {...props} style={{ color: !props.has ? 'red' : '' }} />

const mapStateToProps = ({ detalhes }) => ({
	nome: detalhes.membro.nome,
	ie_batismo: detalhes.membro.ie_batismo,
	ie_crisma: detalhes.membro.ie_crisma,
	ie_matrimonio: detalhes.membro.ie_matrimonio,
	ie_dizimista: detalhes.membro.ie_dizimista
})

const mapDispatchToProps = {
	loadMembro, updateMembro
}

export default connect(mapStateToProps, mapDispatchToProps)(MembroDetalhes)