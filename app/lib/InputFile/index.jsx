import React from 'react'
import { CustomInputFile } from './styles'
import { Row, Col, Media } from 'reactstrap'

export default props => (
	<Row form>
		<Col>
			<CustomInputFile
				{...props}
				label={props.text}
				value=''
				type='file'
			/>
		</Col>
		{
			!!props.value &&
			<Col md={4}>
				<Media object src={mounturl + '/uploads/logo/' + props.value} alt="Logomarca"/>
			</Col>
		}
	</Row>
)
