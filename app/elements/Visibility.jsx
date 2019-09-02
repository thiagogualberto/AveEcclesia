import React from 'react'

const Visibility = props => props.visible ? props.children : null

const VisibilityRow = props => (
	<Visibility visible={props.visible}>
		<tr>{props.children}</tr>
	</Visibility>
)

export { VisibilityRow }
export default Visibility