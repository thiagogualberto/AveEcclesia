const Header = ({ children }) => {

	window.buttons.push((val, row, index) => {
    const h6 = document.createElement('h6')
		h6.className = 'dropdown-header'
		h6.innerText = children
		return h6.outerHTML;
	})

	return null
}

export default Header