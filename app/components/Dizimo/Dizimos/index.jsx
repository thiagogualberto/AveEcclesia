import React, { Component } from 'react'
import { Row, Col, Card, CardHeader, CardBody } from 'reactstrap'

import FormDizimo from './FormDizimo'
import Container from '../../../elements/Container'
import TableDizimos from './TableDizimos'
import { withFormEvents } from '../../../util/form-events'
import date from '../../../util/date'

const defaultValues = {
	dt_pagamento: date.serialize(),
	dt_vencimento: date.serialize(),
}

const Dizimos = props => (
	<Container title='Devoluções'>
		<Row>
			<Col md={8}>
				<Card>
					<CardHeader>Últimos dízimos</CardHeader>
					<CardBody>
						<TableDizimos
							innerRef={props.tableRef}
							onEdit={props.handleEdit`dizimos`}
							onAdd={props.handleAdd`dizimos`}
						/>
					</CardBody>
				</Card>
			</Col>
			<Col>
				<Card>
					<CardHeader>
						{props.edit ? 'Editar dízimo' : 'Lançamento de dízimo'}
						{props.edit && <span onClick={props.handleClose`dizimos`} className='text-danger float-right' style={{ cursor: 'pointer' }} title='Cancelar'><i className='fa fa-times'></i> Cancelar</span>}
					</CardHeader>
					<CardBody>
						<FormDizimo
							edit={props.edit}
							onSubmitSuccess={props.handleSuccess`dizimos`}
							initialValues={props.initial(defaultValues)`dizimos`}
						/>
					</CardBody>
				</Card>
			</Col>
		</Row>
	</Container>
)

export default withFormEvents(Dizimos)