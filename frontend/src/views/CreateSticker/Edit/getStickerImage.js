import pica from 'pica/dist/pica'

import drawSticker from './drawSticker'

// Padding to fit outline and shadow
const PADDING = 24

const createCanvas = (width, height) => {
	const canvas = document.createElement('canvas')
	canvas.width = width
	canvas.height = height
	return canvas
}

// Calculates canvas dimensions to fit the sticker and text objects
const getCanvasDimensions = ({ image }) => {
	let width = image.width + PADDING * 2
	let height = image.height + PADDING * 2
	let translateX = PADDING
	let translateY = PADDING
	/*
	for (const text of texts) {
		const { width, height } = measureText(text)
		// ...
	}
	*/
	return { width, height, translateX, translateY }
}

// Trims transparent pixels
const trimCanvas = canvas => {
	const ctx = canvas.getContext('2d')
	const image = ctx.getImageData(0, 0, canvas.width, canvas.height)
	const length = image.data.length
	let top, left, right, bottom
	for (let i = 0; i < length; i += 4) {
		if (image.data[i + 3] !== 0) {
			const col = (i / 4) % image.width
			const row = (i - col) / 4 / image.width
			if (top === undefined) top = row
			if (bottom === undefined || bottom < row) bottom = row
			if (left === undefined || left > col) left = col
			if (right === undefined || right < col) right = col
		}
	}
	const width = right - left
	const height = bottom - top
	const trimmed = createCanvas(width, height)
	trimmed
		.getContext('2d')
		.putImageData(ctx.getImageData(left, top, width, height), 0, 0)
	return trimmed
}

const getStickerImage = async ({ image, mask, outline, shadow, texts }) => {
	const { width, height, translateX, translateY } = getCanvasDimensions({
		image,
		texts
	})

	const canvas = document.createElement('canvas')
	canvas.width = width
	canvas.height = height
	drawSticker({
		canvas,
		image,
		mask,
		drawMasked: false,
		transform: { translateX, translateY, scale: 1 },
		drawEffects: true,
		outline,
		shadow,
		texts
	})

	// trim transparent pixels
	const trimmed = trimCanvas(canvas)

	// resize image to 512px at the biggest side
	const max = Math.max(trimmed.width, trimmed.height)
	const resized = createCanvas(
		Math.round(trimmed.width / max * 512),
		Math.round(trimmed.height / max * 512)
	)
	await pica().resize(trimmed, resized, { alpha: true })

	// draw resized image at the center of square canvas
	const final = createCanvas(512, 512)
	final
		.getContext('2d')
		.drawImage(
			resized,
			Math.round((512 - resized.width) / 2),
			Math.round((512 - resized.height) / 2)
		)

	return new Promise(resolve => final.toBlob(resolve))
}

export default getStickerImage
