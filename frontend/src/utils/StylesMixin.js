import React from 'react'
import Prefixer from 'inline-style-prefixer'
import composeStyles from './composeStyles'

let prefixers = {}
let allNotSupportedWarnedOnce, unsuppliedUserAgentWarnedOnce, serverRenderingWarnedOnce

let StylesMixin = {
	componentWillMount() {
		this.__super()
		if (!this.state) this.state = {}
		this.getStyles(this.props, this.state, this.context)
	},

	componentWillUpdate(nextProps, nextState, nextContext) {
		this.__super()
		this.getStyles(nextProps, nextState, nextContext)
	},

	getStyles(props, state, context) {
		let rootStyles = Array.isArray(props.style) ?
			props.style.map((style) => { return {root: style} }) :
			{root: props.style}

		let stylesFn = composeStyles(this.constructor.styles, props.styles, rootStyles)
		let styles = stylesFn(props, state, context)

		for (let elem in styles) {
			styles[elem] = this.postprocessStyle(styles[elem])
		}
		this.styles = styles
	},

	postprocessStyle(style) {
		for (let i in style) {
			let value = style[i]
			if (value && value.rgbaString) style[i] = value.rgbaString()
		}

		let autoPrefix = this.context.StylesMixinAutoPrefix
		if (autoPrefix === 'off') {
			return style
		} else if (autoPrefix === 'all') {
			// FUTURE: remove warn, use Prefixer.prefixAll()
			if (!allNotSupportedWarnedOnce) {
				console.warn('StylesMixin: "all" is not supported, autoprefixing is disabled.')
				allNotSupportedWarnedOnce = true
			}
			return style
		} else {
			let prefixer = this.getPrefixer()
			if (prefixer) return prefixer.prefix(style)
			else return style
		}
	},

	getPrefixer() {
		let userAgent
		if (this.context.stylesMixinUserAgent !== undefined) {
			userAgent = this.context.stylesMixinUserAgent
		} else if (typeof navigator !== 'undefined') {
			userAgent = navigator.userAgent
		} else {
			// FUTURE: do not disable autoprefixing, allow auto fallback to prefixAll
			if (!serverRenderingWarnedOnce) {
				serverRenderingWarnedOnce = true
				console.warn('StylesMixin: userAgent should be supplied with UserAgentProvider' +
					'for server-side rendering, autoprefixing is disabled.')
			}
			return
		}

		if (!prefixers[userAgent]) prefixers[userAgent] = new Prefixer({userAgent})
		let prefixer = prefixers[userAgent]
		// FUTURE: remove check and warn, allow auto fallback to prefixAll
		if (prefixer._browserInfo.browser === '') {
			if (!unsuppliedUserAgentWarnedOnce) {
				unsuppliedUserAgentWarnedOnce = true
				console.warn('StylesMixin: supplied userAgent is not supported, ' +
					'autoprefixing is disabled.')
			}
			return
		} else {
			return prefixer
		}
	}
}

// Use as `static contextTypes = StylesMixin.contextTypes`
Object.defineProperty(StylesMixin, 'contextTypes', {
	value: {
		StylesMixinUserAgent: React.PropTypes.string,
		StylesMixinAutoPrefix: React.PropTypes.string
	}
})

export default StylesMixin
