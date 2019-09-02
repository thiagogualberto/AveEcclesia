import React from 'react'

window.actions = []

// Renderiza as actions como string na tabela
window.render_actions = (value, row, index, field) => {

	let outerHTML = '';
	let html = ''

	for (let action of actions) {
		if (html = action(value, row, index, field)) {
			outerHTML += html
		}
	}
	
	return (
		'<div class="btn-container">'
		+ outerHTML +
		'</div>' +
		'<i class="fa fa-spinner fa-spin d-none"></i>'
	)
}

const Actions = ({ title, width, children, ...rest }) => {
	window.actions = []
	return (
		<th {...rest} data-events='events' data-align='center' data-formatter='render_actions' data-width={width}>
			{title}{children}
		</th>
	)
}

export default Actions
