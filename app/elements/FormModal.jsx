import React, { Fragment, PureComponent } from 'react'
import { Row, Form as ReactForm, Button, Alert, Modal as RModal, ModalHeader, ModalBody } from 'reactstrap'

import Field from './Field'

export const modalChange = (edit, name) => {
	$('#modal_' + name).modal(edit ? 'show' : 'hide')
}

export const Modal = props => (
	<div className='modal fade' id={'modal_' + props.name} tabIndex='-1' role='dialog' aria-labelledby={`modal-${props.name}-label`} aria-hidden='true'>
		<div className={'modal-dialog modal-' + props.size || 'md'} role='document'>
			<div className='modal-content'>
				<div className='modal-header'>
					<h5 className='modal-title' id={`modal-${props.name}-label`}>{props.edit ? 'Editar' : 'Adicionar'} {props.title || props.name}</h5>
					<button type='button' className='close' data-dismiss='modal' aria-label='Close'>
						<span aria-hidden='true'>&times;</span>
					</button>
				</div>
				<div className='modal-body'>
					{props.children}
				</div>
			</div>
		</div>
	</div>
)

export const Form = props => (
	<ReactForm className='no-smoothState' onSubmit={props.onSubmit}>
		{props.row === false ? props.children : <Row>{props.children}</Row>}
		{ !!props.error && <Alert color='danger'>{props.error}</Alert> }
		<Button color='success' size='lg' type='submit' block disabled={props.saving}>
			{props.saving ? <Fragment>{props.submittingText} <i className='fa fa-spin fa-spinner'></i></Fragment> : props.submitText}
		</Button>
	</ReactForm>
)

Form.defaultProps = {
	submitText: 'Salvar',
	submittingText: 'Salvando'
}

export class FormModal extends PureComponent {
	
	openModal = () => {
		$('#modal_' + this.props.name).modal('show')
	}
	
	closeModal = () => {
		$('#modal_' + this.props.name).modal('hide')
	}

	render = () => (
		<Modal name={this.props.name} title={this.props.title} size={this.props.size} edit={this.props.edit}>
			<Form onSubmit={this.props.onSubmit} error={this.props.error} saving={this.props.saving} row={this.props.row}>
				{this.props.children}
			</Form>
		</Modal>
	)
}

export const FormStateModal = props => {
	const { isOpen, onCloseForm, size, edit, title, name, component, ...rest } = props
	const Component = component || Form
	return (
		<RModal isOpen={isOpen} toggle={onCloseForm} size={size}>
			<ModalHeader toggle={onCloseForm}>
				{edit !== undefined && (edit ? 'Editar' : 'Adicionar')} {title || name}
			</ModalHeader>
			<ModalBody>
				<Component edit={edit} {...rest} />
			</ModalBody>
		</RModal>
	)
}

export class Campo extends PureComponent {

	static defaultProps = {
		md: 12
	}

	col_to_class(col, num) {
		return `col-${col}-${num}`
	}

	get col() {
		return ' ' + this.col_to_class('md', this.props.md)
	}

	render() {
		const { md, ...props } = this.props
		return (
			<Field
				{...props}
				className={this.col}
			/>
		)
	}
}

export default Form