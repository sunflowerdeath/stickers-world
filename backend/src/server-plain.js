let http = require('http')
let _ = require('lodash')

let server = http.createServer((request, response) => {
	response.writeHead(200, {'Content-Type': 'text/plain'})
	response.end('Hello World ' + _.add(1, 2) + '\n')
})

server.listen(80)
console.log('Server running at http://127.0.0.1:8000/')
