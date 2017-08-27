import React from 'react'

import SvgIcon from '@@/components/SvgIcon'

import cherry from '!raw-loader!./cherry.svg'
import ball from '!raw-loader!./ball.svg'
import cat from '!raw-loader!./cat.svg'
import lightbulb from '!raw-loader!./lightbulb.svg'
import smile from '!raw-loader!./smile.svg'
import travel from '!raw-loader!./travel.svg'
import symbols from '!raw-loader!./symbols.svg'

export default class LoginView extends React.Component {
	render() {
		let root = {
			background: 'white',
			padding: 10,
			width: 280,
			boxSizing: 'border-box',
			display: 'flex',
			justifyContent: 'space-between'
		}
		let style = {
			width: 32,
			height: 32,
			fill: '#bbb'
		}
		let style2 = {
			width: 32,
			height: 32,
			fill: '#666'
		}
		return (
			<div>
				<div style={root}>
					<SvgIcon style={style} svg={smile} />
					<SvgIcon style={style} svg={cherry} />
					<SvgIcon style={style} svg={ball} />
					<SvgIcon style={style} svg={cat} />
					<SvgIcon style={style} svg={lightbulb} />
					<SvgIcon style={style} svg={travel} />
					<SvgIcon style={style} svg={symbols} />
				</div>

				<div style={root}>
					<SvgIcon style={style2} svg={smile} />
					<SvgIcon style={style2} svg={cherry} />
					<SvgIcon style={style2} svg={ball} />
					<SvgIcon style={style2} svg={cat} />
					<SvgIcon style={style2} svg={lightbulb} />
					<SvgIcon style={style2} svg={travel} />
					<SvgIcon style={style2} svg={symbols} />
				</div>
			</div>
		)
	}
}
