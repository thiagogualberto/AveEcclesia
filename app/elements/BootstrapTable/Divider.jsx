const Divider = () => {

	window.buttons.push((val, row, index) => {
    const div = document.createElement('div')
	  div.className = 'dropdown-divider'
		return div.outerHTML;
	})

	return null
}

export default Divider