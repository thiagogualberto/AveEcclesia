import React from 'react'
import ReactDOM from 'react-dom'
import { load } from './util/loadable'

// Carrega o componente
const App = load(() => import('./components/App' /* webpackChunkName: "app" */))

ReactDOM.render(
	<App />,
	document.getElementById('main')
);