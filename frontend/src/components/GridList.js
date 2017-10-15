import React from 'react'

import styledComponent from '@@/utils/styledComponent'

@styledComponent
export default class GridList extends React.Component {
	static displayName = 'GridList'

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
		this.state = {
			itemSize: this.getItemSize(props)
		}
		this.windowResizeListener = () => {
			this.setState({itemSize: this.getItemSize(this.props)})
		}
		window.addEventListener('resize', this.windowResizeListener)
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.windowResizeListener)
	}

	getItemSize({minSize, vMargin}) {
		let screenWidth = document.documentElement.clientWidth
		let itemsInRow = Math.floor((screenWidth - vMargin) / (minSize + vMargin))
		return (screenWidth - vMargin * (itemsInRow + 1)) / itemsInRow
	}

	render() {
		let {items, hMargin, vMargin} = this.props

		let itemsElems = items.map(({key, children, label}) => {
			return <GridListItem
				key={key}
				children={children}
				label={label}
				size={this.state.itemSize}
				hMargin={hMargin}
				vMargin={vMargin}
				onClick={() => this.props.onClickItem && this.props.onClickItem(key)}
			/>
		})

		return <div style={this.styles.root}>{itemsElems}</div>
	}
}

@styledComponent
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
		let {children, label, onClick} = this.props
		return (
			<div
				style={this.styles.root}
				onClick={onClick}
			>
				<div style={this.styles.content}>{children}</div>
				<div style={this.styles.label}>{label}</div>
			</div>
		)
	}


}
