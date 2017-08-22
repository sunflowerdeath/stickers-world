import assert from 'assert'

import mixin from './index'

describe('mixin', function() {
	it('mixes methods and props', function() {
		class A {}
		let mix = {
			method() { return 'mix' },
			prop: 'mix'
		}
		A = mixin(A, mix)

		let a = new A()
		assert.equal(a.method(), 'mix')
		assert.equal(a.prop, 'mix')
	})

	it('mixed methods can set props to obj', function() {
		class A {}
		let mix = {
			method() { this.prop = 'prop' }
		}
		A = mixin(A, mix)

		let a = new A()
		a.method()
		assert.equal(a.prop, 'prop')
	})

	it('works with nested calls', function() {
		class A {
			method1() { return 'base1' }
			method2() { return 'base2' }
		}
		let mix = {
			method1() {
				return this.__super() + 'mixed1'
			},
			method2() {
				return this.method1() + this.__super() + 'mixed2'
			}
		}
		A = mixin(A, mix)

		let a = new A()

		assert.equal(a.method2(), 'base1mixed1base2mixed2')
	})

	it('adds super to mixed method', function() {
		class A {
			constructor() { this.prop = 'A' }
			method() { return this.prop }
		}
		let mix = {
			method() { return this.__super.apply(this) + 'mix' }
		}
		A = mixin(A, mix)

		let a = new A()
		assert.equal(a.method(), 'Amix')
	})

	it('calls super for multiple mixins', function() {
		class A {
			method() { return 'A' }
		}
		let mix1 = {
			method() { return this.__super.apply(this) + 'mix1' }
		}
		let mix2 = {
			method() { return this.__super.apply(this) + 'mix2' }
		}
		A = mixin(A, mix1, mix2)

		let a = new A()
		assert.equal(a.method(), 'Amix1mix2')
	})

	/*
	it('inherits constructors', function() {
		class A {
			constructor() { this.prop = 'A' }
		}
		let mix = {
			__constructor() {
				this.__super()
				this.prop += 'mix'
			}
		}
		A = mixin(A, mix)

		let a = new A()
		assert.equal(a.prop, 'Amix')

		class B extends A {}
		let b = new B()
		assert.equal(b.prop, 'Amix')
	})
	*/
})
