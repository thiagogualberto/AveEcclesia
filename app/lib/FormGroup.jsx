import React, { PureComponent } from 'react'
import { Col, Label, FormGroup as _FormGroup } from 'reactstrap'
import Input from './Input'

export class FormGroup extends PureComponent {

	static defaultProps = {
		_if: true,
		_show: true,
		md: 12,
	}

	render () {

		const { _if, _show, md, label, required, component, ...rest } = this.props
		const Field = component || Input

		return (
			_if &&
			<Col md={md}>
				<_FormGroup className={this.props.className} style={{ display: !!_show ? 'block' : 'none' }}>
					<Label htmlFor={'id_' + this.props.name}>
						{label}
						{required && <span className='text-danger'> *</span>}
					</Label>
					<Field {...rest} id={this.props.id || this.props.name} />
				</_FormGroup>
			</Col>
		)
	}
}

export default FormGroup
