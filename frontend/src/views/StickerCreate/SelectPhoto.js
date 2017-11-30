import React from 'react'

import TopBar from '@@/components/TopBar'
import OverlayLayout from '@@/components/OverlayLayout'
import Tappable from '@@/components/Tappable'

import patrick from '!file-loader!@@/patrick.jpg'

const TOP_BAR_HEIGHT = 50

function getPhotoSize({ screenWidth, minPhotoSize, margin }) {
	const count = Math.floor((screenWidth - margin) / (minPhotoSize + margin))
	console.log(count)
	return (screenWidth - margin * (count + 1)) / count
}

export default class SelectView extends React.Component {
	constructor() {
		super()
		this.photoSize = getPhotoSize({
			screenWidth: document.documentElement.clientWidth,
			minPhotoSize: 70,
			margin: 24
		})
	}
	render() {
		const styles = {
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
				paddingLeft: 24,
				paddingBottom: 20
			}
		}

		let photos = []
		for (let i = 0; i < 55; i++) {
			photos.push(<Photo onSelect={this.props.onSelect} size={this.photoSize} />)
		}

		const topBar = <TopBar>Select photo</TopBar>

		return (
			<OverlayLayout style={styles.root} top={topBar}>
				<div style={styles.photos}>{photos}</div>
			</OverlayLayout>
		)
	}
}

class Photo extends React.Component {
	render() {
		const styles = {
			root: {
				boxSizing: 'border-box',
				marginRight: 24,
				marginBottom: 24,
				width: this.props.size,
				height: this.props.size,
				background: `url(${patrick})`,
				backgroundSize: 'cover',
				borderRadius: 5
			}
		}

		return <Tappable onTap={this.props.onSelect} style={styles.root} />
	}
}
