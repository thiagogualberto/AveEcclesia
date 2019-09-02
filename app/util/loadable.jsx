import React from 'react'
import ReactDOM from 'react-dom'
import Loadable from 'react-loadable'
import { Spinner } from 'reactstrap'
import { Route as ReactRoute } from 'react-router-dom'

const loadingRoot = document.getElementById('loading')
const LoadingPortal = props => {
	return ReactDOM.createPortal(props.children, loadingRoot)
}

export const Loading = () => (
	<LoadingPortal>
		<div
			className='col-sm-9 ml-sm-auto col-md-10 d-flex justify-content-center align-items-center'
			style={{ position: 'fixed', top: 0, bottom: 0, right: 0}}
		>
			<Spinner />
		</div>
	</LoadingPortal>
)

export function load (loader) {
	return Loadable({
		loader: loader,
		loading: Loading
	})
}

export const Route = props => (
	<ReactRoute
		{...props}
		component={!!props.loader ? load(props.loader) : props.component}
	/>
)