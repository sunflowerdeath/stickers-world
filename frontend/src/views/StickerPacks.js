import React from 'react'
import {withRouter} from 'react-router'
import {inject, observer} from 'mobx-react'

import IconButton from 'material-ui/IconButton'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import AddIcon from 'material-ui/svg-icons/content/add'
import {grey600} from 'material-ui/styles/colors'

import OverlayLayout from '@@/components/OverlayLayout'
import TopBar from '@@/components/TopBar'
import GridList from '@@/components/GridList'
import SvgIcon from '@@/components/SvgIcon'
import logoutSvg from '!raw-loader!@@/icons/logout.svg'

@withRouter
@inject('store')
@observer
export default class StickerPacksView extends React.Component {
	render() {
		return (
			<div>
				{this.renderTopBar()}
				<div style={{height: 24}}/>
				{this.renderList()}
				<FloatingActionButton
					backgroundColor={grey600}
					iconStyle={{fill: 'white'}}
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

	renderTopBar() {
		let userPhoto = <div style={{
			width: 32,
			height: 32,
			borderRadius: '50%',
			backgroundColor: '#c4c4c4'
		}} />

		let rightIcon = (
			<IconButton onClick={() => this.props.history.push('/')}>
				<SvgIcon svg={logoutSvg} fill='white' />
			</IconButton>
		)

		return (
			<TopBar
				leftIcon={userPhoto}
				rightIcon={rightIcon}
				onTapRightIcon={this.props.onLogout}
			>
				sunflowerdeath
			</TopBar>
		)
	}

	renderList() {
		let {store} = this.props
		let items = store.packs.values().map((pack) => {
			return {
				key: pack.id,
				label: pack.name,
				children: <div style={{
					backgroundColor: 'white', flex: 1, borderRadius: '50%'}} />
			}
		})

		return (
			<GridList
				items={items}
				onClickItem={(id) => this.props.history.push(`/packs/${id}`)}
			/>
		)
	}
}
