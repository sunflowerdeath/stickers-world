import React from 'react'
import {withRouter} from 'react-router'
import {inject, observer} from 'mobx-react'

import FloatingActionButton from 'material-ui/FloatingActionButton'
import AddIcon from 'material-ui/svg-icons/content/add'
import {grey600} from 'material-ui/styles/colors'
import IconButton from 'material-ui/IconButton'
import ArrowBackIcon from 'material-ui/svg-icons/navigation/arrow-back'
import CircularProgress from 'material-ui/CircularProgress'

import styledComponent from '@@/utils/styledComponent'
import TopBar from '@@/components/TopBar'
import GridList from '@@/components/GridList'
import SvgIcon from '@@/components/SvgIcon'

@withRouter
@inject(({store}, props) => ({
	store: store.packs.get(props.match.params.id)
}))
@observer
@styledComponent
export default class StickerPackView extends React.Component {
	static styles = {
		loader: {
			position: 'absolute',
			top: '45%',
			left: '50%',
			transform: 'translateY(-50%) translateX(-50%)',
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

	constructor(props) {
		super()

		let {store} = props
		if (store && (store.state === 'initial' || store.state === 'error')) {
			store.getStickers()
		}
	}

	render() {
		if (!this.props.store) {
			return this.renderNotFound()
		} else {
			return (
				<div style={{color: 'white'}}>
					{this.renderTopBar()}
					{this.renderContent()}

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

	renderContent() {
		let {store} = this.props
		if (store.state === 'loading') {
			return <CircularProgress style={this.styles.loader} size={60} />
		} else if (store.state === 'error') {
			return <div>Error...</div>
		} else if (store.state === 'ready') {
			if (store.stickers.length === 0) {
				return <div style={this.styles.message}>Sticker pack is empty</div>
			} else {
				return this.renderList()
			}
		}
	}

	renderList() {
		let {store} = this.props
		let items = store.stickers.map((sticker) => {
			return {
				key: sticker.id,
				label: sticker.name,
				children: <div style={{
					backgroundColor: 'white', flex: 1, borderRadius: '50%'}} />
			}
		})

		return (
			<GridList
				style={{marginTop: 24}}
				minSize={72}
				items={items}
			/>
		)
	}
}
