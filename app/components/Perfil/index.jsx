import React, { useState } from 'react'
import { Row, Col, Card, CardTitle } from 'reactstrap'

import FormUsuario from './FormUsuario'
import FormSenha from './FormSenha'
import Container from '../../elements/Container'

const Perfil = props => {
	const [user, setUser] = useState(window.user)
	return (
		<Container title='Perfil' subtitle={user.nome}>
			<Row>
				<Col md={8}>
					<Card body>
						<CardTitle tag='h4'>Informações do Usuário <small>({user.usuario})</small></CardTitle>
						<FormUsuario
							initialValues={user}
							onSubmitSuccess={item => setUser(item)}
						/>
					</Card>
				</Col>
				<Col md={4}>
					<FormSenha />
				</Col>
			</Row>
		</Container>
	)
}

export default Perfil