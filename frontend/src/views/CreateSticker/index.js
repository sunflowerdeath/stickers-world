import React, { Component } from 'react'
import { withRouter } from 'react-router'

import loadImage from '@@/utils/loadImage'

import SelectView from './Select'
import AdjustView from './Adjust'
import EditView from './Edit'
import SaveView from './Save'

import patrick from '!file-loader!@@/patrick.jpg'

/*
state = {
	step: select? | adjust | edit | save,
	imageUrl,
	image,
	crop: { ... },
	croppedImage,
	edits: { ... },
	editedImage
}
*/

@withRouter
class CreateStickerView extends Component {
	constructor(props) {
		super(props)

		const imageUrl = props.location.state && props.location.state.imageUrl

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
		this.loadImage(imageUrl)
	}

	loadImage(url) {
		loadImage(url).then(image => this.setState({ image }))
	}

	render() {
		const { step, selectStepIsSkipped, image, croppedImage } = this.state

		if (step === 'select') {
			return <SelectView onSelect={this.onSelectPhoto.bind(this)} />
		}

		if (step === 'adjust') {
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
		}

		if (step === 'edit') {
			return (
				<EditView
					image={croppedImage}
					onGoBack={() => {
						this.setState({ step: 'adjust' })
					}}
					onGoNext={() => {
						this.setState({ step: 'save' })
					}}
				/>
			)
		}

		if (step === 'save') return <SaveView />
	}
}

export default CreateStickerView
