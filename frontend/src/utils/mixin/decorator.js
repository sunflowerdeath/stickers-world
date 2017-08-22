import mixin from './index'

export default function mixinDecorator(...mixins) {
	return function(type) {
		return mixin(type, ...mixins)
	}
}
