import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { inject, observer } from 'mobx-react'
import floral from 'floral'

import FloatingActionButton from 'material-ui/FloatingActionButton'
import AddIcon from 'material-ui/svg-icons/content/add'
import { grey600 } from 'material-ui/styles/colors'
import IconButton from 'material-ui/IconButton'
import ArrowBackIcon from 'material-ui/svg-icons/navigation/arrow-back'
import CircularProgress from 'material-ui/CircularProgress'

import styledComponent from '@@/utils/styledComponent'
import TopBar from '@@/components/TopBar'
import GridList from '@@/components/GridList'
import SvgIcon from '@@/components/SvgIcon'

const styles = {
	loader: {
		position: 'absolute',
		top: '45%',
		left: '50%',
		transform: 'translateY(-50%) translateX(-50%)'
	},
	message: {
		position: 'absolute',
		top: '45%',
		width: '100%',
		textAlign: 'center',
		transform: 'translateY(-50%)',
		color: 'rgba(255,255,255,0.5)',
		fontSize: 18
	}
}

@withRouter
@inject(({ store }, props) => ({
	store: store.packs[props.match.params.id]
}))
@floral(styles)
@observer
class StickerPackView extends Component {
	static displayName = '123'

	constructor(props) {
		super()

		const { store } = props
		if (
			store &&
			!store.fetchStickersResult
		) {
			store.fetchStickers()
		}
	}

	renderTopBar() {
		const { store } = this.props

		const leftIcon = (
			<IconButton onClick={() => this.props.history.push('/')}>
				<ArrowBackIcon />
			</IconButton>
		)

		return <TopBar leftIcon={leftIcon}>{store.name}</TopBar>
	}

	renderContent() {
		const { store } = this.props
		const { computedStyles } = this.state

		if (store.fetchStickersResult.state === 'pending') {
			return <CircularProgress style={computedStyles.loader} size={60} />
		}

		if (store.fetchStickersResult.state === 'rejected') return <div>Error...</div>

		if (store.fetchStickersResult.state === 'fulfilled') {
			if (store.stickers.length === 0) {
				return (
					<div style={computedStyles.message}>Sticker pack is empty</div>
				)
			} else {
				return this.renderList()
			}
		}
	}

	renderList() {
		const { store } = this.props
		const items = store.stickers.map(sticker => ({
			key: sticker.id,
			label: sticker.name,
			children: (
				<div
					style={{
						backgroundColor: 'white',
						flex: 1,
						borderRadius: '50%'
					}}
				/>
			)
		}))

		return <GridList style={{ marginTop: 24 }} items={items} />
	}

	render() {
		if (!this.props.store) return this.renderNotFound()

		return (
			<div style={{ color: 'white' }}>
				{this.renderTopBar()}
				{this.renderContent()}

				<FloatingActionButton
					backgroundColor={grey600}
					iconStyle={{ fill: 'white' }}
					style={{
						position: 'fixed',
						bottom: 24,
						right: 24
					}}
					onClick={() => {
						this.props.history.push(
							`/packs/${this.props.match.params.id}/create`
						)
					}}
				>
					<AddIcon />
				</FloatingActionButton>
			</div>
		)
	}
}

export default StickerPackView
