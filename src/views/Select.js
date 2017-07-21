import React from 'react'

import TopBar from '@@/components/TopBar'
import OverlayLayout from '@@/components/OverlayLayout'
import Tappable from '@@/components/Tappable'

const TOP_BAR_HEIGHT = 50

export default class SelectView extends React.Component {
	render() {
		let styles = {
			root: {
				height: '100%',
				display: 'flex',
				flexDirection: 'column',
				backgroundColor: 'black'
			},
			photos: {
				height: '100%',
				overflow: 'auto',
				WebkitOverflowScrolling: 'touch',
				paddingTop: TOP_BAR_HEIGHT,
				display: 'flex',
				flexWrap: 'wrap',
				paddingBottom: 20,
			}
		}

		let photos = []
		for (let i = 0; i < 55; i++) {
			photos.push(<Photo onSelect={this.props.onSelect} />)
		}

		let topBar = <TopBar>Select photo</TopBar>

		return (
			<OverlayLayout style={styles.root} top={topBar}>
				<div style={styles.photos}>
					{photos}
				</div>
			</OverlayLayout>
		)
	}
}

class Photo extends React.Component {
	render() {
		let styles = {
			root: {
				width: 100,
				height: 100,
				marginLeft: 20,
				marginBottom: 20,
				backgroundColor: 'white',
				borderRadius: 5
			}
		}

		return (
			<Tappable onTap={this.props.onSelect}>
				<div style={styles.root} />
			</Tappable>
		)
	}
}

