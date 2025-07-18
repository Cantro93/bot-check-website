const http = require('http');
const BotChecker = require('./botcheck');

global.bc = new BotChecker(30, '');

const server = http.createServer((req,res) => {
  let data = '';
  req.on('data', chunk => {data += chunk.toString();});
  req.on('end', () => {
    console.log(`Content type: ${req.headers['content-type']}`);
    console.log(`Received: ${data}`);
    const auth_result = global.bc.auth(req, data, false);
    switch (auth_result.state) {
      case 'accept':
        res.writeHead(200, {'Content-Type': 'text/html', 'Location': 'index.html'});
        res.end(`
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8"/>
            <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
            <meta http-equiv="X-UA-Compatible" content="ie=edge"/>
            <title>Document</title>
          </head>
          <body>
            This would be normal page.
          </body>
          `);
        break;
      case 'reject':
        res.writeHead(403, {'Content-Type': 'text/plain'});
        res.end("Bots are blocked. Retry is possible after 5 minutes.");
        break;
      case 'do_auth':
        res.writeHead(200, {'Content-Type': 'text/html', 'Location': 'verify.html'});
        res.end(auth_result.body);
        break;
      default:
        break;
    }
  });
});

server.listen(3000, '192.168.1.108', () => {console.log("server started")});
