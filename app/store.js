import { createStore, applyMiddleware } from 'redux'
import promise from 'redux-promise'
import thunk from 'redux-thunk'
import multi from 'redux-multi'

import rootReducer from './reducers'

const middlewares = [ promise, thunk, multi ]
const devTools = window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
const store = applyMiddleware(...middlewares)(createStore)(rootReducer, devTools)

export default store