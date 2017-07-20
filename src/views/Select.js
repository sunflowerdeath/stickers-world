import React from 'react'

import TopBar from '@@/components/TopBar'

export default SelectPhotoView extends React.Component {
	render() {
		let styles = {
			photos: {
				display: 'flex'
			},
			photo: {
				width: 50,
				height: 50,
				marginLeft: 20,
				marginBottom: 20,
				backgroundColor: 'white',
				borderRadius: 5
			}
		}

		let photos = []
		for (let i = 0; i < 15; i++) {
			photos.push(<div style={styles.photo} />)
		}

		return (
			<TopBar>Select photo</TopBar>
			<div style={styles.photos>
				{photos}
			</div>
		)
	}
}
