var http = require('http');
var mysql = require('mysql');

var connection = mysql.createConnection({
  host: 'mysql',
  user: 'root',
  password: 'password',
  database: 'stickers_world'
});

var connectionError
try {
	connection.connect();
} catch (e) {
	connectionError = true
}

var handleRequest = function(request, response) {
	console.log('Received request for URL: ' + request.url);
	response.writeHead(200);
	if (connectionError) {
		response.end('CONNECTION ERROR!')
	} else {
		connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
			if (error) {
				response.end('ERROR!')
			} else {
				response.end('THE SOLUTION is: ' + results[0].solution)
			}
		})
	}
};
var www = http.createServer(handleRequest);
www.listen(80);
