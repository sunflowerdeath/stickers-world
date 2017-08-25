import React from 'react'

import styledComponent from '@@/utils/styledComponent'

@styledComponent
export default class Logo extends React.Component {
	static styles = () => {
		let root = {
			fontFamily: 'Lobster, cursive',
			fontSize: 64,
			lineHeight: '0.9em',
			color: '#ddd',
			margin: 'auto',
			width: 250,
			textAlign: 'center',
		}

		return {root}
	}
	
	render() {
		return <div style={this.styles.root}>Stickers world</div>
	}
}
