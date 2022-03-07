import React from 'react'
import ReactDom from 'react-dom'
import App from './components/App'
import './../css/index.css'
import { Provider } from 'react-redux'
import store from './redux/store'
import './i18n'

ReactDom.render(
    <Provider store={store}>
        <App />
    </Provider>
    , document.getElementById('root'))