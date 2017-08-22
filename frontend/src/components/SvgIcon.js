import React from 'react'

let s = document.createElement('style')
s.innerText = '.svgIcon svg {width: 100%; height: 100%}'
document.head.append(s)

export default class SvgIcon extends React.Component {
	render() {
		let {svg, style} = this.props
		return (
			<div
				className='svgIcon'
				style={style}
				dangerouslySetInnerHTML={{__html: svg}}
			/>
		)
	}
}
