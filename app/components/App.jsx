import React, { useEffect } from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter as Router } from 'react-router-dom'

import Header from '../elements/Header'
import Sidebar from '../elements/Sidebar'
import Routes from './Routes'
import store from '../store'

export default () => {

	useEffect(() => {

		// Deixa o load invisível
		const loading = document.querySelector('#initialLoad')
		loading.style.opacity = 0
		
		// Deleta o load da árvore DOM
		setTimeout(() => loading.remove(), 300)
	})

	return (
		<Provider store={store}>
			<Router basename={window.mounturl}>
				<>
					<Header />
					<Sidebar />
					<Routes />
				</>
			</Router>
		</Provider>
	)
}