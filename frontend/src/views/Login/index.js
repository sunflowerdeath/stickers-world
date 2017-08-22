import React from 'react'
import {withRouter} from 'react-router'

import mixin from '@@/utils/mixin/decorator'
import StylesMixin from '@@/utils/stylesMixin'
import matchMediaDecorator from '@@/utils/matchMedia/decorator'
import Tappable from '@@/components/Tappable'
import Logo from '@@/components/Logo'
import SvgIcon from '@@/components/SvgIcon'

import telegramPng from './telegram.png'

import moneyfaceWebp from './moneyface.webp'
import gnomekidWebp from './gnomekid.webp'
import pepeWebp from './pepe.webp'
import pepaWebp from './pepa.webp'
import moneyfacePng from './moneyface.png'
import gnomekidPng from './gnomekid.png'
import pepePng from './pepe.png'
import pepaPng from './pepa.png'

const SYMBOLS = {
	nbsp: '\u00A0',
	sp: ' '
}

@withRouter
@matchMediaDecorator({smallHeight: '(max-height: 700px)'})
@mixin(StylesMixin)
export default class LoginView extends React.Component {
	static displayName = 'LoginView'

	static contextTypes = {
		modernizr: React.PropTypes.object
	}

	static styles = (props, state, context) => {
		let smallHeight = props.matches.smallHeight
		let supportWebp = context.modernizr.webp

		let margin = smallHeight ? 32 : 64
		let stickers = {
			moneyface: {
				position: 'fixed',
				top: 0,
				left: 0,
				width: `${24 * 436 / 512}vh`,
				height: '24vh',
				backgroundImage: `url(${supportWebp ? moneyfaceWebp : moneyfacePng})`,
				backgroundSize: 'cover',
				transform: 'rotate(16deg) translateX(-40%) translateY(20%)'
			},
			gnomekid: {
				position: 'fixed',
				bottom: 0,
				left: 0,
				width: `${33 * 397 / 512}vh`,
				height: '33vh',
				backgroundImage: `url(${supportWebp ? gnomekidWebp : gnomekidPng})`,
				backgroundSize: 'cover',
				transform: 'rotate(-5deg) translateX(-20%) translateY(10%)'
			},
			pepa: {
				position: 'fixed',
				top: '23%',
				right: 0,
				width: '24vh',
				height: '24vh',
				backgroundImage: `url(${supportWebp ? pepaWebp : pepaPng})`,
				backgroundSize: 'cover',
				transform: 'rotate(-20deg) translateX(25%)'
			},
			pepe: {
				position: 'fixed',
				bottom: 0,
				right: 0,
				width: '24vh',
				height: '24vh',
				backgroundImage: `url(${supportWebp ? pepeWebp : pepePng})`,
				backgroundSize: 'cover',
				transform: 'scaleX(-1) rotate(-7deg) translateX(-20%) translateY(5%)'
			}
		}
		return {
			content: {
				color: 'white',
				position: 'absolute',
				top: '10%',
				left: '50%',
				transform: 'translateX(-50%)'
			},
			logo: {
				marginBottom: margin,
			},
			block: {
				width: 250,
				textAlign: 'center',
				margin: 'auto',
				marginBottom: margin,
			},
			button: {
				textTransform: 'uppercase',
				marginBottom: 8,
				fontWeight: '500'
			},
			caption: {
				fontSize: 14,
				color: 'rgba(255,255,255,0.5)'
			},
			telegramLogo: {
				width: 50,
				height: 50,
				backgroundImage: `url(${telegramPng})`,
				backgroundSize: 'cover',
				margin: 'auto',
				marginBottom: 16
			},
			...stickers
		}
	}

	constructor() {
		super()
		this.clientWidth = document.documentElement.clientWidth
		this.clientHeight = document.documentElement.clientHeight
	}

	render() {
		return (
			<div style={this.styles.root}>
				<div style={this.styles.moneyface} />
				<div style={this.styles.gnomekid} />
				<div style={this.styles.pepa} />
				<div style={this.styles.pepe} />

				<div style={this.styles.content}>
					<Logo style={this.styles.logo} />
					{this.renderBlocks()}
				</div>
			</div>
		)
	}

	renderBlocks() {
		return (
			<div>
				<div style={this.styles.block}>
					<Tappable
						style={{cursor: 'pointer'}}
						onTap={() => this.props.history.push('/packs')}
					>
						<div style={this.styles.telegramLogo} />
						<div style={this.styles.button}>Authorize in telegram bot</div>
					</Tappable>
					<div style={this.styles.caption}>
						Send <span style={{color: 'white'}}>/start</span>{SYMBOLS.sp}
						to Stickers World bot and{SYMBOLS.nbsp}then click on link in reply.
						<br/>
						Bot will be able to upload your sticker{SYMBOLS.nbsp}packs to Telegram.
					</div>
				</div>
				<div style={this.styles.block}>
					<Tappable>
						<div style={this.styles.button}>Create sticker</div>
					</Tappable>
					<div style={this.styles.caption}>
						Create sticker without authorization
						<br/>
						and save png file to device.
					</div>
				</div>
			</div>
		)
	}
}
