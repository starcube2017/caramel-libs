var http = require('http');
 var fs = require('fs');
 var path = require('path');

 http.createServer(function (request, response) {

    //console.log('request starting for ');
    //console.log(request);

    var filePath = '.' + request.url;
    if (filePath == './')
        filePath = './index.html';

    console.log(filePath);
    var extname = path.extname(filePath);
    var contentType = 'text/html';
    switch (extname) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
    }
	if(filePath)
	{
		fs.readFile(filePath, function(error, content) {
                if (error) {
                    response.writeHead(500);
                    response.end();
                }
                else {
                    response.writeHead(200, { 'Content-Type': contentType });
                    response.end(content, 'utf-8');
                }
        });	
	}else {
        response.writeHead(404);
        response.end();
    }
  

 }).listen(process.argv[2] || 5000);

 console.log('Server running at http://127.0.0.1:5000/');