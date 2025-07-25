const http = require('http');
const BotChecker = require('../botcheck');

global.bc = new BotChecker(60, '');

const server = http.createServer((req,res) => {
  if (req.url.includes('favicon')) {
    res.writeHead(404);
    res.end();
    return;
  }
  let data = '';
  req.on('data', chunk => {data += chunk.toString();});
  req.on('end', () => {
    console.log(`Content type: ${req.headers['content-type']}`);
    console.log(`Received: ${data}`);
    const auth_result = global.bc.auth(req, data, false);
    switch (auth_result.state) {
      case 'accept':
        res.writeHead(200, {'Content-Type': 'text/html', 'Location': 'index.html'});
        //res.end(require('fs').fsReadFileSync('internal-index.html', 'utf8'));
        res.end(`<!DOCTYPE html> <html lang="en"> <head>   <meta charset="UTF-8">   <meta name="viewport" content="width=device-width, initial-scale=1.0">   <meta http-equiv="X-UA-Compatible" content="ie=edge">   <title>Document</title> </head> <body>   <h1>Welcome to BotCheck website</h1>   <br>   <p>NOTE: this website is WIP</p>    <p>     BotCheck is Node.js module that implements verification forms that are shown to clients of your server when they connect for the first time, and then after specified interval.     Learn more on <a href="https://github.com/Cantro93/bot-check">Github repo page</a>.     BotCheck is free software under LGPL 2.1, distributed without warranty. </p> <p>You are accessing webpage ${req.url}</p> <p><a href="http://${req.headers.host}${req.url}" </body> </html>`);
        break;
      case 'reject':
        res.writeHead(403, {'Content-Type': 'text/plain'});
        res.end("Bots are blocked. Retry is possible after 1 minute.");
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

server.listen(80, '0.0.0.0', () => {console.log("server started")});
