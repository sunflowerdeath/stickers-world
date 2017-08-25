import mixin from '../mixin'

import StyledComponentMixin from './StyledComponentMixin'

export default (Component) => {
	let StyledComponent = mixin(Component, StyledComponentMixin)
	StyledComponent.contextTyles = StyledComponentMixin.contextTypes
	let name = Component.displayName || Component.name
	StyledComponent.displayName = name ? `styled(${name})` : 'StyledComponent'
	return StyledComponent
}
