import ReactDOM from 'react-dom'

const headerRoot = document.getElementById('header')

export default props => {
	return ReactDOM.createPortal(props.children, headerRoot)
}
