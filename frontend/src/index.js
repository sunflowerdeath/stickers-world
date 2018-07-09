import Modernizr from 'modernizr'
import React from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import { Provider } from 'mobx-react'

import api from './api/fakeApi'
import StickersWorldStore from './stores/StickersWorldStore'
import muiTheme from './muiTheme'
import App from './app'

const store = new StickersWorldStore(api)

window.store = store

class ModernizrContextProvider extends React.Component {
	static childContextTypes = {
		modernizr: PropTypes.object
	}
	getChildContext() {
		return { modernizr: this.props.features }
	}
	render() {
		return this.props.children
	}
}

Modernizr.on('webp', webp => {
	const app = (
		<Provider store={store}>
			<MuiThemeProvider muiTheme={muiTheme}>
				<ModernizrContextProvider features={{ webp }}>
					<App />
				</ModernizrContextProvider>
			</MuiThemeProvider>
		</Provider>
	)
	ReactDOM.render(app, document.querySelector('.container'))
})
