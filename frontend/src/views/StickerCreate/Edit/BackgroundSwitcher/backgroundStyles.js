import photo from './photo.jpg'
import checkers from './checkers.svg'

export default {
	black: {
		backgroundColor: 'black'
	},
	white: {
		backgroundColor: 'white'
	},
	chekers: {
		backgroundColor: 'white',
		backgroundImage: `url(${checkers})`,
		backgroundSize: '30px 30px'
	},
	photo: {
		backgroundImage: `url(${photo})`,
		backgroundSize: 'cover'
	}
}
