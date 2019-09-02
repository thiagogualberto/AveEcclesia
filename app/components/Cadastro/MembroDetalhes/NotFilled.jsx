import React, { Fragment } from 'react'
import ButtonIcon from '../../../elements/ButtonIcon'
import Visibility from '../../../elements/Visibility';

export default props => (
	<div className='form-fill'>
		{!!props.filled && props.children}
		<Visibility visible={!props.filled}>
			<p>Esse membro não possui {props.label}</p>
			{
				props.actions.map((item, index) => (
					<ButtonIcon
						key={index}
						type='secondary'
						icon='plus'
						className='mr-2'
						title={item.title}
						onClick={item.onClick} /> 
				))
			}
		</Visibility>
	</div>
)
