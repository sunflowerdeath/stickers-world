import React from 'react'
import {withRouter} from 'react-router'
import {inject, observer} from 'mobx-react'

import FloatingActionButton from 'material-ui/FloatingActionButton'
import AddIcon from 'material-ui/svg-icons/content/add'
import {grey600} from 'material-ui/styles/colors'
import IconButton from 'material-ui/IconButton'
import ArrowBackIcon from 'material-ui/svg-icons/navigation/arrow-back'

import TopBar from '@@/components/TopBar'
import GridList from '@@/components/GridList'
import SvgIcon from '@@/components/SvgIcon'

@withRouter
@inject(({store}, props) => ({
	store: store.packs.get(props.match.params.id)
}))
@observer
export default class StickerPackView extends React.Component {
	constructor(props) {
		super()

		let {store} = props
		if (store && (store.state === 'initial' || store.state === 'error')) {
			store.getStickers()
		}
	}

	render() {
		return this.props.store ? this.renderContent() : this.renderNotFound()
	}
	
	renderContent() {
		return (
			<div style={{color: 'white'}}>
				{this.renderTopBar()}
				{this.renderList()}

				<FloatingActionButton
					backgroundColor={grey600}
					iconStyle={{fill: 'white'}}
					style={{
						position: 'fixed',
						bottom: 24,
						right: 24
					}}
					onClick={() => {
						this.props.history.push(`/packs/${this.props.match.params.id}/create`)
					}}
				>
					<AddIcon />
				</FloatingActionButton>
			</div>
		)
	}

	renderTopBar() {
		let {store} = this.props
		let leftIcon = (
			<IconButton onClick={() => this.props.history.push('/packs')}>
				<ArrowBackIcon />
			</IconButton>
		)

		return <TopBar leftIcon={leftIcon}>{store.name}</TopBar>
	}

	renderList() {
		let {store} = this.props
		if (store.state === 'loading') {
			return <div>Loading</div>
		} else if (store.state === 'error') {
			return <div>Error...</div>
		} else if (store.state === 'ready') {
			if (store.stickers.length === 0) {
				return <div>Sticker pack is empty</div>
			} else {
				return <div>List</div>
			}
		}
	}
}
