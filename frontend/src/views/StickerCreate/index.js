import React, { Component } from 'react'
import IconButton from 'material-ui/IconButton'
import TextField from 'material-ui/TextField'
import FlatButton from 'material-ui/FlatButton'
import ArrowBackIcon from 'material-ui/svg-icons/navigation/arrow-back'

import TopBar from '@@/components/TopBar'

import SelectPhotoView from './SelectPhoto'
import AdjustView from './Adjust'
import EditView from './Edit'

import patrick from '!file-loader!@@/patrick.jpg'
const WIDTH = 249
const HEIGHT = 320

export default class CreateStickerView extends Component {
	state = {
		step: 'select'
	}

	onSelectPhoto(photo) {
		this.setState({ step: 'adjust', photo })
	}

	render() {
		const { step } = this.state

		if (step === 'select') {
			return <SelectPhotoView onSelect={this.onSelectPhoto.bind(this)} />
		} else if (step === 'adjust') {
			return (
				<AdjustView
					image={{ width: WIDTH, height: HEIGHT, src: patrick }}
					onGoBack={() => {
						this.setState({ step: 'select' })
					}}
					onGoNext={() => {
						this.setState({ step: 'edit' })
					}}
				/>
			)
		} else if (step === 'edit') {
			return (
				<EditView
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
