export default (...methods) => Class => {
	class BoundClass extends Class {
		static displayName = Class.displayName || Class.name

		constructor(...args) {
			super(...args)
			methods.forEach(method => {
				this[method] = this[method].bind(this)
			})
		}
	}

	return BoundClass
}

