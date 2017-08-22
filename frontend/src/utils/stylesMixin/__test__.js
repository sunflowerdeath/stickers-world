import React from 'react'
import ReactDOM from 'react-dom'
import assert from 'assert'
import {mount} from 'enzyme'

import Color from 'color'
import mixin from '../mixin/decorator'
import StylesMixin from './index.js'
import composeStyles from './composeStyles.js'

describe('stylesMixin', function() {
	let wrapper

	afterEach(function() {
		if (wrapper) wrapper.unmount()
	})

	@mixin(StylesMixin)
	class Styleable extends React.Component {
		render() { return <div/> }
	}

	it('gets styles from prop styles', function() {
		const STYLES = {root: {color: 'red'}, elem: {color: 'green'}}
		wrapper = mount(<Styleable styles={STYLES}/>)

		let styles = wrapper.get(0).styles
		assert.deepEqual(STYLES, styles)
	})

	it('gets styles for root from prop style', function() {
		const STYLE = {color: 'red'}
		wrapper = mount(<Styleable style={STYLE}/>)

		let styles = wrapper.get(0).styles
		assert.deepEqual(styles.root, STYLE)
	})

	it('gets styles from static property styles', function() {
		const STYLES = {root: {color: 'red'}, elem: {color: 'green'}}
		@mixin(StylesMixin)
		class Styleable extends React.Component {
			static styles = STYLES
			render() { return <div/> }
		}

		wrapper = mount(<Styleable/>)

		let styles = wrapper.get(0).styles
		assert.deepEqual(styles, STYLES)
	})

	it('allows to use function to define styles', function() {
		function getStyles(props) {
			return {root: {color: props.color}}
		}
		wrapper = mount(<Styleable color='green' styles={getStyles}/>)

		let styles = wrapper.get(0).styles
		assert.equal(styles.root.color, 'green')
	})

	it('merges styles from different props', function() {
		const STATIC_PROP = {fromStatic: {color: 'red'}, root: {color: 'red'}}
		const STYLES_PROP = {fromStyles: {color: 'green'}, root: {color: 'green'}}
		const STYLE_PROP = {color: 'blue'}
		const EXPECTED_STYLES = {
			fromStatic: {color: 'red'},
			fromStyles: {color: 'green'},
			root: {color: 'blue'}
		}

		@mixin(StylesMixin)
		class Styleable extends React.Component {
			static styles = STATIC_PROP
			render() { return <div/> }
		}
		wrapper = mount(<Styleable styles={STYLES_PROP} style={STYLE_PROP}/>)

		let styles = wrapper.get(0).styles
		assert.deepEqual(styles, EXPECTED_STYLES)
	})

	it('replaces Color objects with rgba colors', function() {
		let STYLE = {color: new Color('red')}
		wrapper = mount(<Styleable style={STYLE}/>)

		let styles = wrapper.get(0).styles
		assert.equal(styles.root.color, 'rgba(255, 0, 0, 1)')
	})
})

describe('stylesMixin/composeStyles', function() {
	it('composes styles', function() {
		let STYLES_A = {root: {fontWeight: 'bold'}}
		let STYLES_B = function(props) {
			return {root: {color: props.color}}
		}

		let composed = composeStyles(STYLES_A, STYLES_B)
		let styles = composed({color: 'red'})
		assert.deepEqual(styles, {root: {color: 'red', fontWeight: 'bold'}})
	})
})
