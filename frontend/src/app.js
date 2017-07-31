import React from 'react'

let WIDTH = 300
let HEIGHT = 400

import SelectView from '@@/views/Select'
import AdjustView from '@@/views/Adjust'
import EditView from '@@/views/Edit'

export default class App extends React.Component {
	state = {
		screen: 'select'
	}

	render() {
		if (this.state.screen === 'select') {
			return <SelectView onSelect={this.onSelectPhoto.bind(this)} />
		} else if (this.state.screen === 'adjust') {
			let {width, height} = this.state.image
			return <AdjustView width={width} height={height} />
		}
	}

	onSelectPhoto() {
		this.setState({screen: 'adjust', image: {width: 200, height: 150}})
	}
}
