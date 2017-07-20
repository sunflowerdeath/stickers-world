import React from 'react'

import TopBar from '@@/components/TopBar'
import OverlayLayout from '@@/components/OverlayLayout'

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
				boxSizing: 'border-box',
				paddingTop: TOP_BAR_HEIGHT + 20,
				display: 'flex',
				flexWrap: 'wrap',
				overflow: 'auto',
				paddingBottom: 20,
				WebkitOverflowScrolling: 'touch'
			},
			photo: {
				width: 100,
				height: 100,
				marginLeft: 20,
				marginBottom: 20,
				backgroundColor: 'white',
				borderRadius: 5
			}
		}

		let photos = []
		for (let i = 0; i < 55; i++) {
			photos.push(<div style={styles.photo} />)
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
