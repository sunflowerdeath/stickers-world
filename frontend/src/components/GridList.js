import React, { Component } from 'react'
import floral from 'floral'

const styles = props => ({
	root: {
		display: 'flex',
		flexWrap: 'wrap',
		paddingLeft: props.vMargin
	}
})

@floral(styles)
class GridList extends Component {
	static defaultProps = {
		minSize: 100,
		vMargin: 24,
		hMargin: 24
	}

	constructor(props) {
		super()
		this.state = {
			itemSize: this.getItemSize(props)
		}
		this.windowResizeListener = () => {
			this.setState({ itemSize: this.getItemSize(this.props) })
		}
		window.addEventListener('resize', this.windowResizeListener)
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.windowResizeListener)
	}

	getItemSize({ minSize, vMargin }) {
		const screenWidth = document.documentElement.clientWidth
		const itemsInRow = Math.floor((screenWidth - vMargin) / (minSize + vMargin))
		return (screenWidth - vMargin * (itemsInRow + 1)) / itemsInRow
	}

	render() {
		const { items, hMargin, vMargin } = this.props
		const { computedStyles } = this.state

		const itemsElems = items.map(({ key, children, label }) => (
			<GridListItem
				key={key}
				label={label}
				size={this.state.itemSize}
				hMargin={hMargin}
				vMargin={vMargin}
				onClick={() => this.props.onClickItem && this.props.onClickItem(key)}
			>
				{children}
			</GridListItem>
		))

		return <div style={computedStyles.root}>{itemsElems}</div>
	}
}

const itemStyles = ({ size, hMargin, vMargin }) => ({
	root: {
		marginRight: hMargin,
		marginBottom: vMargin,
		width: size
	},
	content: {
		height: size,
		display: 'flex',
		alignItems: 'stretch',
		marginBottom: 12
	},
	label: {
		fontSize: 14,
		color: 'white',
		textAlign: 'center'
	}
})

const GridListItem = floral(itemStyles)(props => {
	const { children, label, onClick, computedStyles } = props
	return (
		<div style={computedStyles.root} onClick={onClick}>
			<div style={computedStyles.content}>{children}</div>
			<div style={computedStyles.label}>{label}</div>
		</div>
	)
})

export default GridList
