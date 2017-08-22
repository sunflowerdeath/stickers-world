import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme'
import getMuiTheme from 'material-ui/styles/getMuiTheme'

export default getMuiTheme({
	...darkBaseTheme,
	palette: {
		...darkBaseTheme.palette,
		primary1Color: '#ffffff'
	}
})
