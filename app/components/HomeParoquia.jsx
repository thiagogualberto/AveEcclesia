import React, { Component } from 'react'
import { Row, Col, ListGroup, ListGroupItem, Badge, Spinner } from 'reactstrap'
import moment from 'moment'

import api from '../api'
import { getPeriodo } from '../util/date'
import Container from '../elements/Container'

export default () => (
	<Container title='Paróquia'>
		<Row>
			<Aniversariantes />
		</Row>
	</Container>
)

// const CardInfo = props => (
// 	<Col className='mb-3' lg={3} md={4} sm={6} xs={12}>
// 		<Card>
// 			<CardHeader>
// 				<strong>{props.title}</strong>
// 			</CardHeader>
// 			<CardBody>
// 				<CardTitle>{props.items}</CardTitle>
// 				<CardText>Total: {props.total}</CardText>
// 			</CardBody>
// 		</Card>
// 	</Col>
// )

class Aniversariantes extends Component {

	state = {
		dizimistas: [],
		loading: true
	}

	renderDizimista = (data, index) => (
		<ListGroupItem key={index} className='d-flex justify-content-between align-items-center'>
			{ data.nome }
			<Badge pill color='success'>
				{moment(data.dt_nascimento).format('DD/MM')}
			</Badge>
		</ListGroupItem>
	)

	render () {
		return (
			<Col md={{ size: 5 }}>
				<h4 className='mb-4'>Dizimistas Aniversariantes da semana</h4>
				<ListGroup>
					{ this.state.loading && <Spinner size='sm' color='primary' /> }
					{
						this.state.dizimistas.length == 0 && this.state.loading == false ?
						<p>Nenhum aniversariante</p> :
						this.state.dizimistas.map(this.renderDizimista)
					}
				</ListGroup>
			</Col>
		)
	}

	componentDidMount() {
		api.loadData('/dizimista/nivers', {
			start_date: getPeriodo('week_start'),
			end_date: getPeriodo('week_end')
		}).then(({data}) => {
			this.setState({ dizimistas: data, loading: false })
		})
	}
}