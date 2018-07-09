import React, { Component } from 'react'
import floral from 'floral'

import TopBar from '@@/components/TopBar'
import OverlayLayout from '@@/components/OverlayLayout'

import patrick from '!file-loader!@@/patrick.jpg'

import Photo from './Photo'

const TOP_BAR_HEIGHT = 50

const getPhotoSize = ({ screenWidth, minPhotoSize, margin }) => {
	const photosInRow = Math.floor((screenWidth - margin) / (minPhotoSize + margin))
	return (screenWidth - margin * (photosInRow + 1)) / photosInRow
}

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

@floral(styles)
class SelectView extends Component {
	constructor() {
		super()
		this.photoSize = getPhotoSize({
			screenWidth: document.documentElement.clientWidth,
			minPhotoSize: 70,
			margin: 24
		})
	}

	render() {
		const photos = []
		for (let i = 0; i < 55; i++) {
			photos.push(
				<Photo
					onTap={() => this.props.onSelect(patrick)}
					size={this.photoSize}
					url={patrick}
				/>
			)
		}

		const topBar = <TopBar>Select photo</TopBar>

		return (
			<OverlayLayout style={styles.root} top={topBar}>
				<div style={styles.photos}>{photos}</div>
			</OverlayLayout>
		)
	}
}

export default SelectView
