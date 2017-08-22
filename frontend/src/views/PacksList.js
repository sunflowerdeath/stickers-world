import React from 'react'

import OverlayLayout from '@@/components/OverlayLayout'
import TopBar from '@@/components/TopBar'
import GridList from '@@/components/GridList'

export default class PacksListView extends React.Component {
	render() {
		return (
			<div>
				{this.renderTopBar()}
				{this.renderList()}
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
		return (
			<TopBar
				leftIcon={userPhoto}
				onTapRightIcon={this.props.onLogout}
			>
				sunflowerdeath
			</TopBar>
		)
	}

	renderList() {
		let items = [
			{id: '1', name: 'Label'},
			{id: '2', name: 'Label'},
			{id: '3', name: 'Label'},
			{id: '4', name: 'Label'}
		]

		let gridItems = items.map(({id, name}) => {
			return {
				id,
				label: 'name',
				children: <div style={{
					backgroundColor: 'white', flex: 1, borderRadius: '50%'}} />
			}
		})

		return <GridList items={gridItems} />
	}
}
