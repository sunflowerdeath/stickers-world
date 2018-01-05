import React, { Component } from 'react'
import { withRouter } from 'react-router'
import IconButton from 'material-ui/IconButton'
import TextField from 'material-ui/TextField'
import FlatButton from 'material-ui/FlatButton'
import ArrowBackIcon from 'material-ui/svg-icons/navigation/arrow-back'

import loadImage from '@@/utils/loadImage'
import TopBar from '@@/components/TopBar'

import SelectPhotoView from './SelectPhoto'
import AdjustView from './Adjust'
import EditView from './Edit'

import patrick from '!file-loader!@@/patrick.jpg'

@withRouter
export default class CreateStickerView extends Component {
	constructor(props) {
		super(props)

		const imageUrl = props.location.state.imageUrl

		if (imageUrl) {
			this.state = {
				step: 'adjust',
				imageUrl,
				selectStepIsSkipped: true
			}
			this.loadImage(imageUrl)
		} else {
			this.state = { step: 'select' }
		}
	}

	onSelectPhoto(imageUrl) {
		this.setState({ step: 'adjust', imageUrl })
	}

	loadImage(url) {
		loadImage(url).then(image => this.setState({ image }))
	}

	render() {
		const { step, selectStepIsSkipped, image, croppedImage } = this.state

		if (step === 'select') {
			return <SelectPhotoView onSelect={this.onSelectPhoto.bind(this)} />
		} else if (step === 'adjust') {
			if (!image) return <div>Loading...</div>

			return (
				<AdjustView
					image={image}
					onGoBack={() => {
						if (selectStepIsSkipped) {
							this.props.history.push('/')
						} else {
							this.setState({ step: 'select' })
						}
					}}
					onGoNext={croppedImage => {
						this.setState({ step: 'edit', croppedImage })
					}}
				/>
			)
		} else if (step === 'edit') {
			return (
				<EditView
					image={croppedImage}
					onGoBack={() => {
						this.setState({ step: 'adjust' })
					}}
					onGoNext={() => {
						console.log('OK')
					}}
				/>
			)
		}
	}
}

class SaveSticker extends Component {
	renderTopBar() {
		const leftIcon = (
			<IconButton
				onClick={() =>
					this.props.history.push(`/packs/${this.props.match.params.id}`)
				}
			>
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
					<TextField fullWidth floatingLabelText="Name" />
					<TextField fullWidth floatingLabelText="Title" />
					<FlatButton
						labelStyle={{ fontSize: 18 }}
						style={{
							display: 'block',
							margin: 'auto',
							fontSize: 18,
							marginTop: 24
						}}
					>
						DONE
					</FlatButton>
				</div>
			</div>
		)
	}
}
