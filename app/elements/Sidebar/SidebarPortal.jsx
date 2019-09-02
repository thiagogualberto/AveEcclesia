import ReactDOM from 'react-dom'

const sidebarRoot = document.getElementById('sidebar')

export default props => {
	return ReactDOM.createPortal(props.children, sidebarRoot)
}
