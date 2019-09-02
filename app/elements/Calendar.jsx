import React, {Component} from 'react'
import { Popover, PopoverBody } from 'reactstrap';
import './Calendar.css'

import ButtonIcon from './ButtonIcon'

const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
const slug_meses = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ']

const hoje = new Date
hoje.setDate(1)

class Calendar extends Component {

	state = {
		date: hoje,
		popoverOpen: false
	}

	get month_year() {
		const date = this.state.date
		return meses[date.getMonth()] + ' ' + date.getFullYear()
	}

	handleMonth(fator = 1) {

		const date = new Date(this.state.date)
		const atual = date.getMonth()

		date.setMonth(atual + fator)
		this.setDate(date)
	}

	handleYear(fator = 1) {

		const date = new Date(this.state.date)
		const atual = date.getFullYear()

		date.setFullYear(atual + fator)
		this.setDate(date)
	}

	toggle = () =>  {
		this.setState({ popoverOpen: !this.state.popoverOpen })
	}

	setDate = date => {
		this.setState({ date })
		this.props.onChange(date)
	}

	renderMonthBtn = (mes, index) => (
		<ButtonMes
			key={mes}
			month={mes}
			index={index}
			date={this.state.date}
			selectMonth={date => this.setDate(date) }
		/>
	)

	render() {
		return (
			<div className='Calendar row position-relative d-flex justify-content-between'>
				<ButtonIcon
					type='link'
					icon='chevron-left'
					color='#babec5'
					onClick={() => this.handleMonth(-1)}
				/>
				<ButtonIcon
					type='link'
					icon='chevron-right'
					color='#babec5'
					onClick={() => this.handleMonth(1)}
				/>
				<ButtonIcon
					id='popover_calendar'
					type='link'
					icon='calendar'
					color='#2ca01c'
					iconColor='#babec5'
					className='text-uppercase text-decoration-none font-weight-bold position-absolute w-100'
					title={this.month_year}
					onClick={this.toggle}
				/>
				<Popover placement='bottom' isOpen={this.state.popoverOpen} target='popover_calendar' toggle={this.toggle}>
					<PopoverBody style={{width: '218px'}}>
						<div className='d-flex justify-content-between align-items-center'>
							<ButtonIcon type='link' icon='chevron-left' color='#babec5' onClick={() => this.handleYear(-1)} />
							<span className='font-weight-bold' style={{ color: '#8d9096'}}>
								{this.state.date.getFullYear()}
							</span>
							<ButtonIcon type='link' icon='chevron-right' color='#babec5' onClick={() => this.handleYear(1)} />
						</div>
						<div className='months'>
							{ slug_meses.map(this.renderMonthBtn) }
						</div>
					</PopoverBody>
				</Popover>
			</div>
		)
	}
}

const ButtonMes = props => {

	const date = new Date(props.date)
	date.setMonth(props.index)
	
	return (
		<div onClick={() => props.selectMonth(date)}
			className={'btn col-3' + (props.index == props.date.getMonth() ? ' selected' : '') }>
			{props.month}
		</div>
	)
}

export default Calendar
