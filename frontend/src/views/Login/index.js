import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'
import floral from 'floral'
import Taply from 'taply'

import matchMediaDecorator from '@@/utils/matchMedia/decorator'
import Tappable from '@@/components/Tappable'
import Logo from '@@/components/Logo'

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

const PLATFORM = 'web'

const styles = props => {
	const smallHeight = props.matches.smallHeight
	const supportWebp = false // TODO context.modernizr.webp

	const margin = smallHeight ? 32 : 64
	const stickers = {
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
			top: '21%',
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
			marginBottom: margin
		},
		block: {
			width: 250,
			textAlign: 'center',
			margin: 'auto',
			marginBottom: margin
		},
		button: {
			textTransform: 'uppercase',
			marginBottom: 8,
			fontWeight: '500'
		},
		fileInput: {
			display: 'none'
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

@withRouter
@matchMediaDecorator({ smallHeight: '(max-height: 700px)' })
@floral(styles)
export default class LoginView extends React.Component {
	static contextTypes = {
		modernizr: PropTypes.object
	}

	constructor() {
		super()
		this.onTapCreate = this.onTapCreate.bind(this)
		this.onSelectFile = this.onSelectFile.bind(this)
	}

	onTapCreate() {
		if (PLATFORM === 'web') {
			this.fileInputRef.click()
			return
		}

		this.props.history.push('/create')
	}

	onSelectFile() {
		const [file] = this.fileInputRef.files
		const imageUrl = URL.createObjectURL(file)
		this.props.history.push('/create', { imageUrl })
	}

	renderBlocks() {
		const { computedStyles } = this.state
		return (
			<div>
				<div style={computedStyles.block}>
					<Tappable
						style={{ cursor: 'pointer' }}
						onTap={() =>
							this.props.history.push('https://telegram.org/')
						}
					>
						<div style={computedStyles.telegramLogo} />
						<div style={computedStyles.button}>
							Authorize in telegram bot
						</div>
					</Tappable>
					<div style={computedStyles.caption}>
						Send <span style={{ color: 'white' }}>/start</span>
						{SYMBOLS.sp}
						to Stickers World bot and{SYMBOLS.nbsp}then click on link in
						reply.
						<br />
						Bot will be able to upload your sticker{SYMBOLS.nbsp}packs to
						Telegram.
					</div>
				</div>
				<Taply onTap={this.onTapCreate}>
					<div style={computedStyles.block}>
						<div style={computedStyles.button}>Create sticker</div>
						<div style={computedStyles.caption}>
							Create sticker without authorization
							<br />
							and save png file to device.
						</div>
					</div>
				</Taply>
				<input
					type="file"
					accept="image/*"
					style={computedStyles.fileInput}
					ref={ref => {
						this.fileInputRef = ref
					}}
					onChange={this.onSelectFile}
				/>
			</div>
		)
	}

	render() {
		const { computedStyles } = this.state
		return (
			<div style={computedStyles.root}>
				<div style={computedStyles.moneyface} />
				<div style={computedStyles.gnomekid} />
				<div style={computedStyles.pepa} />
				<div style={computedStyles.pepe} />

				<div style={computedStyles.content}>
					<Logo style={computedStyles.logo} />
					{this.renderBlocks()}
				</div>
			</div>
		)
	}
}
