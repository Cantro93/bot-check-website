const http = require('http');
const BotChecker = require('./botcheck');

global.bc = new BotChecker(300, '');

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
        res.end(require('fs').fsReadFileSync('index.html', 'utf8'));
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
