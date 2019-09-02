import React from 'react'
import { connect } from 'react-redux'

import Toggle from '../elements/Toggle'
import ButtonIcon from '../elements/ButtonIcon'
import { toggleQuitado, toggleDelete, editData } from '../actions/transacoesAction'

const Row = props => {
	const editData = () => props.editData(props.data)
	return (
		<tr>
			<td>
				<input
					type='checkbox'
					checked={~props.delete.indexOf(props.data)}
					onChange={() => props.toggleDelete(props.data)}
				/>
			</td>
			<td onClick={editData}>{format(props.data.dt_pagamento, 'date')}</td>
			<td onClick={editData}>{props.data.descricao}</td>
			<td onClick={editData}>{props.data.pessoa_nome}</td>
			<td onClick={editData}>R$ {format(props.data.pago, 'money')}</td>
			<td onClick={editData}>{props.data.categoria_descricao}</td>
			<td><Toggle value={props.data.quitado} onChange={() => props.toggleQuitado(props.data)} /></td>
			<td><ButtonIcon icon='chevron-down' type='link' color='#212529' /></td>
		</tr>
	)
}

const mapStateToProps = state => ({
	delete: state.transacoes.delete
})

const mapDispatchToProps = {
	toggleQuitado, toggleDelete, editData
}

export default connect(mapStateToProps, mapDispatchToProps)(Row)