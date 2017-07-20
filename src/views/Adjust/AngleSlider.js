import React from 'react'

export default class AngleSlider extends React.Component {
	render() {
		let {value} = this.props

		let dots = []
		for (i = -45; i <= +45; i +=5) {
			dots.push(<div style={i === 0 ? styles.bar : styles.dot} />)
		}

		let dots = <div style={styles.dot} />
		return (
			<div style={styles.root}>
				<div style={styles.pointer}/>
				<div style={styles.dots}>
					{dots}
				</div>
				<div style={styles.value}
					{value}
				</div>
			</div>
		)
	}
}
