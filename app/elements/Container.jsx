import React from 'react'
import { withRouter } from 'react-router-dom'

import Title from './Title'
import FadingComponent from '../elements/FadingComponent'

const Container = props => {
	const { children, title, subtitle, renderToolbar, history, staticContext, ...rest} = props
	return (
		<FadingComponent {...rest} onClick={e => onClickEvent(e, history)}>
			<Title subtitle={subtitle} renderToolbar={renderToolbar}>{title}</Title>
			{children}
		</FadingComponent>
	)
}

/**
 * Filtra os eventos de click para redirecionar caso seja um link
 * 
 * @param {Event} e Evento de click
 * @param {History} history Objeto de history proveniente do withRouter
 */
function onClickEvent(e, history)
{
	const target = e.target.closest('a')

	if (target !== null && target.className === 'react-link')
	{
		e.preventDefault()
		e.stopPropagation()

		history.push(target.dataset.path)
	}
}

export default withRouter(Container)