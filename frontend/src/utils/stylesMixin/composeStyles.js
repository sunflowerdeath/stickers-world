import _ from 'underscore'

/**
 * Composes `styles` props for each element.
 * If styles uses functions, they are combined
 * to single function that returns merged results.
 */
export default function composeStyles(...stylesList) {
	return function(props, state, context) {
		let composed = {}
		let flatStylesList = _.flatten(stylesList)
		for (let i in flatStylesList) {
			let styles = flatStylesList[i]
			let result = typeof styles === 'function' ? styles(props, state, context) : styles
			for (let item in result) {
				if (composed[item] === undefined) composed[item] = {}
				Object.assign(composed[item], result[item])
			}
		}
		return composed
	}
}
