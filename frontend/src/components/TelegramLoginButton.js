import React, { Component } from 'react'
import PropTypes from 'prop-types'

class TelegramLoginButton extends Component {
	static propTypes = {
		botName: PropTypes.string.isRequired,
		size: PropTypes.string,
		radius: PropTypes.string,
		userpic: PropTypes.string,
		requestAccess: PropTypes.string,
		onAuth: PropTypes.func.isRequired
	}

	static defaultProps = {
		size: 'large',
		radius: '20',
		userpic: 'false',
		requestAccess: 'write'
	}

	componentDidMount() {
		const { botName, size, radius, userpic, requestAccess, onAuth } = this.props

		window.TelegramLoginButtonOnAuth = onAuth

		const script = document.createElement('script')
		script.src = 'https://telegram.org/js/telegram-widget.js?4'
		script.setAttribute('data-telegram-login', botName)
		script.setAttribute('data-size', size)
		script.setAttribute('data-radius', radius)
		script.setAttribute('data-request-access', requestAccess)
		script.setAttribute('data-userpic', userpic)
		script.setAttribute('data-onauth', 'TelegramLoginWidget.dataOnauth(user)')
		script.async = true
		this.ref.appendChild(script)
	}

	render() {
		return (
			<div
				ref={ref => {
					this.ref = ref
				}}
			/>
		)
	}
}

export default TelegramLoginButton
