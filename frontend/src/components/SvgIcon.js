import React from 'react'

const style = document.createElement('style')
style.innerText = '.svgIcon svg {width: 100%; height: 100%}'
document.head.append(style)

const SvgIcon = ({ svg, fill, style, ...restProps }) => (
	<div
		className="svgIcon"
		style={{ width: '100%', height: '100%', fill, ...style }}
		dangerouslySetInnerHTML={{ __html: svg }}
		{...restProps}
	/>
)

export default SvgIcon
