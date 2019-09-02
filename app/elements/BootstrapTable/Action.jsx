import { newEvent } from './util'

const Action = props => {
	
	newEvent(props.className, props.onClick)
	window.actions.push((val, row, index) => {
		
		// Caso tenha condição de renderização
		if (props._if !== undefined && !eval(props._if)) return
	
		const icon = document.createElement('i')
		const button = document.createElement('button')
	
		icon.className = 'fa fa-' + props.icon;
	
		button.type = 'button'
		button.className = 'icon-action btn btn-link ' + props.className
		button.title = props.title
		button.dataset.field = props.field || 'id'
		button.appendChild(icon);
		button.style.color = props.color

		return button.outerHTML
	})

	return null
}

export default Action