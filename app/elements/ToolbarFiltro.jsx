import React, { Component } from 'react'
import moment from 'moment'
import { connect } from 'react-redux'
import isEqual from 'lodash/isEqual'

import Select from './Select'
import Visibility from './Visibility'
import ButtonIcon from './ButtonIcon'
import { getPeriodo } from '../util/date'

const data = [
	{
		label: 'Este mês',
		value: { start_date: getPeriodo('month_start'), end_date: getPeriodo('month_end') }
	},
	{
		label: 'Esta semana',
		value: { start_date: getPeriodo('week_start'), end_date: getPeriodo('week_end') }
	},
	{
		label: 'Hoje',
		value: { start_date: getPeriodo('today'), end_date: getPeriodo('today') }
	}
]

const status = [
	{ value: 'todas', label: 'Todas' },
	{ value: 'pago', label: 'Pago' },
	{ value: 'pendente', label: 'Todas a pagar' },
	{ value: 'vencer', label: 'A vencer hoje' },
	{ value: 'atraso', label: 'Vencidas (em atraso)' }
]

class ToobarFiltro extends Component {
	
	render () {
		const { start_date, end_date, ...filtro } = this.props.filtro

		// Confere se está no mesmo período mensal, ou na mesma semana
		const samePeriod = moment(start_date).isSame(new Date, 'month') ||   // Mesmo mês
											isEqual(data[1].value, { start_date, end_date }) // Mesma semana

		return (
			<div className='toolbar' style={{ padding: '11.5px 15px' }}>
				<div className='row'>
					<div className='col-2'>
						<Select
							name='filter'
							options={data}
							defaultValue={data[0]}
							isSearchable={false}
							value={samePeriod ? undefined : {'label': 'Este mês'}}
							disabled={!samePeriod}
							onChange={e => this.props.onChange({ ...e.target.value })} 
							defaultValue={data[0]}
						/>
					</div>
					<div className='col-3'>
						<Select
							name='status'
							options={status}
							isSearchable={false}
							defaultValue={status[0]}
							// format={item => ({ label: 'Status: ' + item.label, value: item.value })}
							onChange={e => this.props.onChange({ status: e.target.value })} 
						/>
					</div>
					<Visibility visible={false}>
						<div className='col-auto'>
							<ButtonIcon icon='times' type='outline-secondary' title='Limpar filtros' />
						</div>
					</Visibility>
				</div>
			</div>
		)
	}
}

const mapStateToProps = state => ({
	filtro: state.transacoes.filtro
})

export default connect(mapStateToProps)(ToobarFiltro)