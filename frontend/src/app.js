import React from 'react'
import {Route, Switch, Link} from 'react-router-dom'

import matchMediaDecorator from '@@/utils/matchMedia/decorator'

import LandscapeWarningView from '@@/views/LandscapeWarning'
import LoginView from '@@/views/Login'
import PacksListView from '@@/views/PacksList'
import CreateStickerPackView from '@@/views/CreateStickerPack'
import SelectView from '@@/views/Select'
import AdjustView from '@@/views/Adjust'
import EditView from '@@/views/Edit'

let WIDTH = 300
let HEIGHT = 400

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
		let phoneLandscape = this.props.matches.phoneLanscape

		if (phoneLandscape) {
			return <LandscapeWarningView />
		} else {
			return (
				<Switch>
					<Route path='/' exact={true} component={LoginView} />
					<Route path='/packs' exact={true} component={PacksListView} />
					<Route path='/packs/create' exact={true} component={CreateStickerPackView} />
				</Switch>
			)
		}
		// if (this.state.screen === 'select') {
			// return <SelectView onSelect={this.onSelectPhoto.bind(this)} />
		// } else if (this.state.screen === 'adjust') {
			// let {width, height} = this.state.image
			// return <AdjustView width={width} height={height} />
		// }
	}

	onSelectPhoto() {
		this.setState({screen: 'adjust', image: {width: 200, height: 150}})
	}
}
