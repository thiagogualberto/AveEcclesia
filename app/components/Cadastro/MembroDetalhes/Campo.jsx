import React, { PureComponent } from 'react'
import Col from 'reactstrap/lib/Col'
import Field from '../../../elements/Field'

class Campo extends PureComponent {

	static defaultProps = {
		md: 12
	}

	render() {
		const { md, input: { value, name, onChange }, ...props } = this.props
		return (
			<Col md={md}>
				<Field {...props} value={value} name={name} onChange={e => onChange(e.target.value)} />
			</Col>
		)
	}
}

export default Campo