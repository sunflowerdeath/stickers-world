import React from 'react'

let WIDTH = 300
let HEIGHT = 400

let style = {}

export default class App extends React.Component {
	render() {
		return (
			<div style={styles.root}>
				<div style={styles.editor}>
					<canvas style={styles.canvas} width={WIDTH} height={HEIGHT} />
					<canvas style={styles.editor} width={WIDTH} height={HEIGHT} />
				</div>
				<div style={styles.settings}>
					<div>
						Tool:
						<br/>
						PAINT | ERASE
						<br/>
						Brush size:
						<input type='range' />
					</div>
					<div>
						Preview:
						<br/>
						ORIGINAL | WHITE | BLACK | TRANSPARENT | BACKGROUND
					</div>
					<div>
						Border:
						<input type='checkbox' />
						color:
						<input type='color' />
						size:
						<input type='range' />
					</div>
					<div>
						Shadow:
						<input type='checkbox' />
						color:
						<input type='color' />
						size:
						<input type='range' />
						blur:
						<input type='range' />
					</div>
				</div>
			</div>
		)
	}
}
