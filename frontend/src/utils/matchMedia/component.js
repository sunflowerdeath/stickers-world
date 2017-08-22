import React from 'react'

export default class MatchMediaComponent extends React.Component {
	constructor(props) {
		super()

		this.state = {
			matches: {}
		}

		this.matchers = []

		for (let name in props.queries) {
			let matcher = window.matchMedia(props.queries[name])
			this.state.matches[name] = matcher.matches
			let listener = () => {
				this.state.matches[name] = matcher.matches
				this.setState({
					matches: {
						...this.state.matches,
						[name]: matcher.matches
					}
				})
			}
			matcher.addListener(listener)
			this.matchers.push({matcher, listener})
		}
	}

	componentWillUnmount() {
		this.matchers.forEach(({matcher, listener}) => matcher.removeListener(listener))
	}

	render() {
		return React.cloneElement(this.props.children, {matches: this.state.matches})
	}
}
