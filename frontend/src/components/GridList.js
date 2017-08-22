import React from 'react'

import mixin from '@@/utils/mixin/decorator'
import StylesMixin from '@@/utils/stylesMixin'
import Tappable from '@@/components/Tappable'

function getItemSize({screenWidth, minSize, vMargin}) {
	let itemsInRow = Math.floor((screenWidth - vMargin) / (minSize + vMargin))
	return (screenWidth - vMargin * (itemsInRow + 1)) / itemsInRow
}

@mixin(StylesMixin)
export default class GridList extends React.Component {
	static defaultProps = {
		minSize: 100,
		vMargin: 24,
		hMargin: 24
	}

	static styles = (props) => {
		let root = {
			display: 'flex',
			flexWrap: 'wrap',
			paddingLeft: props.vMargin
		}
		return {root}
	}

	constructor(props) {
		super()

		let {minSize, vMargin} = props

		this.itemSize = getItemSize({
			screenWidth: document.documentElement.clientWidth,
			minSize,
			vMargin
		})
	}

	render() {
		let {items, hMargin, vMargin} = this.props

		let itemsElems = items.map(({id, children, label}) => {
			return (
				<GridListItem
					id={id}
					children={children}
					label={label}
					size={this.itemSize}
					hMargin={hMargin}
					vMargin={vMargin}
					onTap={() => this.props.onTap(item)}
				/>
			)
		})

		return <div style={this.styles.root}>{itemsElems}</div>
	}
}

@mixin(StylesMixin)
class GridListItem extends React.Component {
	static styles = (props) => {
		let {size, hMargin, vMargin} = props

		let root = {
			marginRight: hMargin,
			marginBottom: vMargin,
			width: size
		}

		let content = {
			height: size,
			display: 'flex',
			alignItems: 'stretch',
			marginBottom: 12
		}

		let label = {
			fontSize: 14,
			color: 'white',
			textAlign: 'center'
		}

		return {root, content, label}
	}

	render() {
		let {children, label, onTap} = this.props
		return (
			<Tappable
				style={this.styles.root}
				onTap={onTap}
			>
				<div style={this.styles.content}>{children}</div>
				<div style={this.styles.label}>{label}</div>
			</Tappable>
		)
	}
}
