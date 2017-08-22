import Modernizr from 'modernizr'
import React from 'react'
import ReactDOM from 'react-dom'
import {BrowserRouter} from 'react-router-dom'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

import muiTheme from './muiTheme'
import App from './app'

class ModernizrContextProvider extends React.Component {
	static childContextTypes = {
		modernizr: React.PropTypes.object
	}
	getChildContext() { return {modernizr: this.props.features} }
	render() { return this.props.children }
}

Modernizr.on('webp', (webp) => {
	let app = (
		<MuiThemeProvider muiTheme={muiTheme}>
			<BrowserRouter>
				<ModernizrContextProvider features={{webp}}>
					<App />
				</ModernizrContextProvider>
			</BrowserRouter>
		</MuiThemeProvider>
	)
	ReactDOM.render(app, document.querySelector('.container'))
})

