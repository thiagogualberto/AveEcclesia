import React from 'react'

window.buttons = []

// Renderiza o dropdown como string na tabela
window.render_dropdown = (value, row, index, field) => {

	let html = ''
	let outerHTML = ''

	for (let button of buttons) {
		if (html = button(value, row, index, field)) {
			outerHTML += html
		}
	}

	return (
		'<div class="btn-group">' +
			`<a href="#" class="btn btn-outline-secondary btn-sm dropdown-toggle" id="dropdown-${index}" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Ações</a>` +
			`<div class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdown-${index}">` +
				outerHTML +
			'</div>' +
		'</div>'
	)
}

const Buttons = ({ title, children, width, ...rest }) => {
	window.buttons = []
	return (
		<th {...rest} data-events='events' data-align='center' data-formatter='render_dropdown' data-width={width} children={title}>
			{title}{children}
		</th>
	)
}

export default Buttons
