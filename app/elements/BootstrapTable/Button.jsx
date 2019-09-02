import { newEvent } from './util'

const Button = props => {

	newEvent(props.className, props.onClick)
	window.buttons.push((val, row, index) => {
		
		// Caso tenha condição de renderização
		if (props._if !== undefined && !eval(props._if)) return

		const button = document.createElement('a')

		button.href = '#'
		button.role = 'button'
		button.className = 'dropdown-item ' + props.className + (props.disabled ? ' disabled' : '')
		button.innerHTML = '<i class="fa fa-' + props.icon + '"></i>' + props.title
		button.style.color = props.color

		return button.outerHTML;
	})

	return null
}

export default Button