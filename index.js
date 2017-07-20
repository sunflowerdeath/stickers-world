var canvas = document.getElementById('canvas')
var ctx = canvas.getContext('2d')

var WIDTH = 249
var HEIGHT = 320

ctx.fillStyle = 'rgb(200, 0, 0)'
ctx.fillRect(10, 10, 50, 50)

ctx.lineWidth = 30
ctx.strokeStyle = 'blue'
ctx.lineCap = 'round'

var body = document.getElementsByTagName('body')[0]
var drawing
var lastY, lastX
canvas.addEventListener('mousedown', function(event) {
	drawing = true
	lastX = event.clientX
	lastY = event.clientY

})

function draw() {
	ctx.globalCompositeOperation = 'source-over'
}

function erase() {
	ctx.globalCompositeOperation = 'destination-out'
}

body.addEventListener('mouseup', function() {
	drawing = false
	// TODO if did not moved since mousedown, just paint circle
})

body.addEventListener('mousemove', function(event) {
	if (drawing) {
		let x = event.clientX
		let y = event.clientY
		if (x !== lastX || y !== lastY) {
			ctx.beginPath()
			ctx.moveTo(lastX, lastY)
			ctx.lineTo(x, y)
			ctx.stroke()
			lastX = x
			lastY = y
		}
	}
})

// ctx.fillRect(5, 5, 1, 1)
// ctx.fillRect(2, 2, 1, 1)
// var image = ctx.getImageData(0, 0, WIDTH, HEIGHT)

// In Manhattan, the distance between any two places is the number of blocks you have to walk
// to get there. You must travel in a stair step fashion as you cannot cut diagonally through 
// buildings.
// O(n^2) solution to find the Manhattan distance to not transparent pixels in an image
function manhattan(image) {
	let {width, height, data} = image
	let distances = new Uint8Array(width * height)

	// traverse from top left to bottom right
	for (let row = 0; row < height; row++) {
		for (let col = 0; col < width; col++) {
			let i = row * width + col

			if (data[i * 4 + 3] === 255) { // is transparent
				distances[i] = 0
			} else {
				// It is at most the sum of the lengths of the array
				// away from a pixel that is on
				distances[i] = width + height
				// or one more than the pixel to the top
				if (row > 0) {
					distances[i] = Math.min(distances[i], distances[(row - 1) * width + col] + 1)
				}
				// or one more than the pixel to the left
				if (col > 0) distances[i] = Math.min(distances[i], distances[i-1] + 1)
			}
		}
	}

	// traverse from bottom right to top left
	for (let row = height - 1; row >= 0; row--) {
		for (let col = width - 1; col >= 0; col--) {
			let i = row * width + col
			// either what we had on the first pass
			// or one more than the pixel to the bottom
			if (row + 1 < height) {
				distances[i] = Math.min(distances[i], distances[(row + 1) * width + col] + 1)
			}
			// or one more than the pixel to the right
			if (col + 1 < width) distances[i] = Math.min(distances[i], distances[i+1] + 1)
		}
	}

	return distances
}

function stroke(image, strokeWidth) {
	let distances = manhattan(image)
	let {width, height, data} = image

	for (let row = 0; row < height; row++) {
		for (let col = 0; col < width; col++) {
			let i = row * width + col
			if (distances[i] <= strokeWidth && distances[i] > 0) {
				data[i * 4] = 0
				data[i * 4 + 1] = 255
				data[i * 4 + 2] = 0
				data[i * 4 + 3] = 255
				// data[i * 4 + 3] = 255 - Math.floor(distances[i] / strokeWidth * 255)
			}
		}
	}
	return image
}

/*
function dilate(image, k) {
	image = manhattan(image)
	for (let i = 0; i < image.length; i++){
		for (let j = 0; j < image[i].length; j++) {
			image[i][j] = image[i][j] <= k ? 1 : 0
		}
	}
	return image
}

function hz() {
	let source = ctx.createImageData(400, 300)
	let dilated = ctx.createImageData(source)
}
*/

document.getElementsByTagName('button')[0].addEventListener('click', function() {
	let image = ctx.getImageData(0, 0, WIDTH, HEIGHT)
	let stroked = stroke(image, 5)
	ctx.putImageData(stroked, 0, 0)
})
