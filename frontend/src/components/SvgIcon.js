import React from 'react'

const style = document.createElement('style')
style.innerText = '.svgIcon svg {width: 100%; height: 100%}'
document.head.append(style)

export default class SvgIcon extends React.Component {
	render() {
		let { svg, fill, style, ...restProps } = this.props
		return (
			<div
				className="svgIcon"
				style={{ width: '100%', height: '100%', fill, ...style }}
				dangerouslySetInnerHTML={{ __html: svg }}
				{...restProps}
			/>
		)
	}
}
