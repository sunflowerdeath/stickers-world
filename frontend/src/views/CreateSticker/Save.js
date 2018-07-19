import React, { Component } from 'react'

import IconButton from 'material-ui/IconButton'
import TextField from 'material-ui/TextField'
import FlatButton from 'material-ui/FlatButton'
import ArrowBackIcon from 'material-ui/svg-icons/navigation/arrow-back'

import TopBar from '@@/components/TopBar'

class SaveStickerView extends Component {
	renderTopBar() {
		const leftIcon = (
			<IconButton onClick={this.props.onGoBack}>
				<ArrowBackIcon />
			</IconButton>
		)

		return <TopBar leftIcon={leftIcon}>Create sticker</TopBar>
	}

	render() {
		return (
			<div>
				{this.renderTopBar()}
				<div style={{ padding: '0 24px' }}>
					<img src={this.props.stickerUrl} />
					<TextField fullWidth floatingLabelText="Name" />
					<TextField fullWidth floatingLabelText="Emojis" />
					<FlatButton
						labelStyle={{ fontSize: 18 }}
						style={{
							display: 'block',
							margin: 'auto',
							fontSize: 18,
							marginTop: 24
						}}
					>
						CREATE
					</FlatButton>
				</div>
			</div>
		)
	}
}

export default SaveStickerView
