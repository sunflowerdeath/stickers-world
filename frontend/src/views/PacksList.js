import React from 'react'
import {withRouter} from 'react-router'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import AddIcon from 'material-ui/svg-icons/content/add'
import {grey600} from 'material-ui/styles/colors'

import OverlayLayout from '@@/components/OverlayLayout'
import TopBar from '@@/components/TopBar'
import GridList from '@@/components/GridList'
import SvgIcon from '@@/components/SvgIcon'
import logoutSvg from '!raw-loader!@@/icons/logout.svg'

@withRouter
export default class PacksListView extends React.Component {
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
			<SvgIcon
				svg={logoutSvg}
				fill='white'
				style={{padding: 12, boxSizing: 'border-box'}}
				onClick={() => this.props.history.push('/')}
			/>
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
		let items = [
			{key: '1', name: 'Label'},
			{key: '2', name: 'Label'},
			{key: '3', name: 'Label'},
			{key: '4', name: 'Label'}
		]

		let gridItems = items.map(({key, name}) => {
			return {
				key,
				label: 'name',
				children: <div style={{
					backgroundColor: 'white', flex: 1, borderRadius: '50%'}} />
			}
		})

		return <GridList items={gridItems} />
	}
}
