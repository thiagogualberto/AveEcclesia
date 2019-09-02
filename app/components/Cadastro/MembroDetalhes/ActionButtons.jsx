import React, { Fragment } from 'react'
import { Prompt } from 'react-router'
import { connect } from 'react-redux'
import { Button } from 'reactstrap'

import ButtonIcon from '../../../elements/ButtonIcon'
import { editForm, closeForm } from '../../../actions/membroAction'
import ButtonLoad from '../../../elements/ButtonLoad';

const ActionButtons = props => {
	function closeForm() {
		props.closeForm()
		props.reset()
	}
	return (
		<Fragment>
			<div className={props.edit ? 'd-none' : ''}>
				<ButtonIcon icon='edit' type='secondary' title='Editar' onClick={() => props.editForm(props.form)} />
			</div>
			<div className={props.edit ? 'float-right' : 'd-none'}>
				<Button className='mr-2' onClick={closeForm}>Cancelar</Button>
				<ButtonLoad color='primary' onClick={props.submit} loading={props.submitting} text='Salvar' loadingText='Salvando...' />
			</div>
			<Prompt
				when={props.dirty}
				message='Você possui mudanças não salvas, deseja realmente sair dessa página?'
			/>
		</Fragment>
	)
}

const mapStateToProps = ({ detalhes }) => ({
	edit: detalhes.edit
})

const mapDispatchToProps = {
	editForm, closeForm
}

export default connect(mapStateToProps, mapDispatchToProps)(ActionButtons)
