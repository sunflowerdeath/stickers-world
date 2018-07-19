import { contours } from 'd3-contour'
import flatten from 'lodash/flatten'

import simplify from '@@/utils/simplify'

const getOutlines = imageData => {
	const { width, height, data } = imageData
	const generator = contours()
		.size([width, height])
		.smooth(true)
		.thresholds([128])
	const grid = new Uint8Array(width * height)
	for (let x = 0; x < width; x += 1) {
		for (let y = 0; y < height; y += 1) {
			const index = y * width + x
			grid[index] = data[index * 4 + 3]
		}
	}
	const outlines = flatten(generator(grid)[0].coordinates)
	return outlines.map(points => simplify(points, 1))
}

const drawPath = (ctx, points) => {
	ctx.beginPath()
	ctx.moveTo(points[0][0], points[0][1])
	for (let i = 1; i < points.length; i += 1) {
		const point = points[i]
		ctx.lineTo(point[0], point[1])
	}
	ctx.closePath()
	ctx.stroke()
}

const drawOutline = ({ ctx, width, color }) => {
	if (width === 0) return

	const outlines = getOutlines(
		ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height)
	)
	ctx.strokeStyle = color

	// 1px inner outline
	ctx.globalCompositeOperation = 'source-over'
	ctx.lineWidth = 2
	outlines.forEach(points => drawPath(ctx, points))

	// outer outline
	if (width > 1) {
		ctx.globalCompositeOperation = 'destination-over'
		ctx.lineWidth = width * 2
		outlines.forEach(points => drawPath(ctx, points))
	}
}

const drawShadow = ({ ctx, size }) => {
	if (size <= 3) return

	ctx.globalCompositeOperation = 'destination-over'
	ctx.shadowColor = 'rgba(0,0,0,0.6)'
	ctx.shadowOffsetY = 1
	ctx.shadowOffsetX = 1
	ctx.shadowBlur = size
	ctx.drawImage(ctx.canvas, 0, 0, ctx.canvas.width, ctx.canvas.height)
	ctx.shadowColor = 'transparent'
}

const drawSticker = ({
	canvas,
	image,
	mask,
	drawMasked,
	transform,
	drawEffects,
	outline,
	shadow
}) => {
	const ctx = canvas.getContext('2d')
	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

	const { scale } = transform
	const translateX = Math.round(transform.translateX)
	const translateY = Math.round(transform.translateY)
	const width = Math.round(image.width * scale)
	const height = Math.round(image.height * scale)

	// draw image
	ctx.globalAlpha = 1
	ctx.imageSmoothingEnabled = true
	ctx.globalCompositeOperation = 'source-over'
	ctx.drawImage(image, translateX, translateY, width, height)

	// mask image
	ctx.globalCompositeOperation = 'destination-out'
	ctx.drawImage(mask, translateX, translateY, width, height)

	// draw semi-transparent image over masked image
	if (drawMasked) {
		ctx.globalCompositeOperation = 'source-over'
		ctx.globalAlpha = 0.5
		ctx.drawImage(image, translateX, translateY, width, height)
	}

	if (drawEffects) {
		drawOutline({ ctx, ...outline })
		drawShadow({ ctx, ...shadow })
	}
}

export default drawSticker
