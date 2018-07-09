import React, { Component } from 'react'
import { withRouter } from 'react-router'
import {inject} from 'mobx-react'

import IconButton from 'material-ui/IconButton'
import TextField from 'material-ui/TextField'
import FlatButton from 'material-ui/FlatButton'
import ArrowBackIcon from 'material-ui/svg-icons/navigation/arrow-back'

import OverlayLayout from '@@/components/OverlayLayout'
import TopBar from '@@/components/TopBar'

@withRouter
@inject('store')
class CreateStickerPackView extends Component {
	state = {
		name: '',
		title: ''
	}

	onChangeName(event) {
		const name = event.target.value
		this.setState({ name })
	}

	onChangeTitle(event) {
		const title = event.target.value
		this.setState({ title })
	}

	onSubmit() {
		const { name, title } = this.state
		this.setState({ isSubmitting: true })
		this.props.store.createPack({ name, title }, this.props.history)
	}

	renderTopBar() {
		const back = (
			<IconButton onClick={() => this.props.history.push('/packs')}>
				<ArrowBackIcon />
			</IconButton>
		)

		return <TopBar leftIcon={back}>Create sticker pack</TopBar>
	}

	render() {
		const { name, title } = this.state

		return (
			<div>
				{this.renderTopBar()}
				<div style={{ padding: '0 24px' }}>
					<TextField
						fullWidth
						floatingLabelText="Name"
						value={name}
						onChange={this.onChangeName.bind(this)}
					/>
					<TextField
						fullWidth
						floatingLabelText="Title"
						value={title}
						onChange={this.onChangeTitle.bind(this)}
					/>
					<FlatButton
						labelStyle={{ fontSize: 18 }}
						style={{
							display: 'block',
							margin: 'auto',
							fontSize: 18,
							marginTop: 24
						}}
						onClick={this.onSubmit.bind(this)}
					>
						DONE
					</FlatButton>
				</div>
			</div>
		)
	}
}

export default CreateStickerPackView
