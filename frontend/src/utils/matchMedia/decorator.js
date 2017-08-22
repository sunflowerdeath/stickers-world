import React from 'react'

import MatchMediaComponent from './component'

export default (queries) => (Component) => {
	let Wrapper = (props) => {
		return (
			<MatchMediaComponent queries={queries}>
				<Component {...props} />
			</MatchMediaComponent>
		)
	}
	Wrapper.displayName = 'MatchMediaWrapper'
	return Wrapper
}
