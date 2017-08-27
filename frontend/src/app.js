import React from 'react'
import {Route, Switch, Redirect} from 'react-router-dom'
import {BrowserRouter} from 'react-router-dom'
import {inject, observer} from 'mobx-react'

import matchMediaDecorator from '@@/utils/matchMedia/decorator'

import LandscapeWarningView from '@@/views/LandscapeWarning'
import LoginView from '@@/views/Login'
import StickerPacksView from '@@/views/StickerPacks'
import CreateStickerPackView from '@@/views/CreateStickerPack'
import StickerPackView from '@@/views/StickerPack'
import CreateStickerView from '@@/views/CreateSticker'
import SelectView from '@@/views/Select'
import AdjustView from '@@/views/Adjust'
import EditView from '@@/views/Edit'
import TestView from '@@/views/Test'

let WIDTH = 300
let HEIGHT = 400

@inject('store')
@observer
@matchMediaDecorator({
	phoneLanscape: 
		`(min-width: 400px)
		and (max-width: 768px)
		and (max-height: 500px)
		and (orientation: landscape)`
})
export default class App extends React.Component {
	state = {
		screen: 'select'
	}

	render() {
		return <TestView />
		let phoneLandscape = this.props.matches.phoneLanscape

		if (phoneLandscape) {
			return <LandscapeWarningView />
		} else {
			return this.renderRoutes()
		}
		// if (this.state.screen === 'select') {
			// return <SelectView onSelect={this.onSelectPhoto.bind(this)} />
		// } else if (this.state.screen === 'adjust') {
			// let {width, height} = this.state.image
			// return <AdjustView width={width} height={height} />
		// }
	}

	renderRoutes() {
		let {store} = this.props
		return (
			<BrowserRouter>
				<Switch>
					<Route path='/' exact={true} component={LoginView} />
					<Route path='/packs' exact={true} component={StickerPacksView} />
					<Route path='/packs/create' exact={true} component={CreateStickerPackView} />
					<Route path='/packs/:id/create' exact={true} component={CreateStickerView} />
					<Route
						path='/packs/:id'
						exact={true} 
						render={(props) => {
							if (store.packs.has(props.match.params.id)) {
								return <StickerPackView {...props} />
							} else {
								return <Redirect to='/packs' />
							}
						}}
					/>
				</Switch>
			</BrowserRouter>
		)
	}

	onSelectPhoto() {
		this.setState({screen: 'adjust', image: {width: 200, height: 150}})
	}
}
