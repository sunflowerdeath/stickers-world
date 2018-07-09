import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { inject, observer } from 'mobx-react'
import floral from 'floral'

import IconButton from 'material-ui/IconButton'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import AddIcon from 'material-ui/svg-icons/content/add'
import { grey600 } from 'material-ui/styles/colors'

import TopBar from '@@/components/TopBar'
import GridList from '@@/components/GridList'
import SvgIcon from '@@/components/SvgIcon'
import logoutSvg from '!raw-loader!@@/icons/logout.svg'

const styles = {
	avatar: {
		width: 32,
		height: 32,
		borderRadius: '50%',
		backgroundColor: '#c4c4c4'
	},
	createButton: {
		position: 'fixed',
		bottom: 24,
		right: 24
	},
	pack: {
		backgroundColor: 'white',
		flex: 1,
		borderRadius: '50%'
	}
}

@withRouter
@inject('store')
@floral(styles)
@observer
class StickerPacksView extends Component {
	renderTopBar() {
		const { store, onLogout, history } = this.props
		const { computedStyles } = this.state

		const avatar = <div style={computedStyles.avatar} />
		const logout = (
			<IconButton onClick={() => store.logout()}>
				<SvgIcon svg={logoutSvg} fill="white" />
			</IconButton>
		)
		return (
			<TopBar leftIcon={avatar} rightIcon={logout} onTapRightIcon={onLogout}>
				{store.user.name}
			</TopBar>
		)
	}

	renderList() {
		const { store } = this.props
		const { computedStyles } = this.state

		const items = Object.values(store.packs).map(pack => ({
			key: pack.id,
			label: pack.name,
			children: <div style={computedStyles.pack} />
		}))

		return (
			<GridList
				items={items}
				onClickItem={id => this.props.history.push(`/packs/${id}`)}
			/>
		)
	}

	render() {
		return (
			<div>
				{this.renderTopBar()}
				<div style={{ height: 24 }} />
				{this.renderList()}
				<FloatingActionButton
					backgroundColor={grey600}
					iconStyle={{ fill: 'white' }}
					style={{
						position: 'fixed',
						bottom: 24,
						right: 24
					}}
					onClick={() => this.props.history.push('/packs/create')}
				>
					<AddIcon />
				</FloatingActionButton>
			</div>
		)
	}
}

export default StickerPacksView
