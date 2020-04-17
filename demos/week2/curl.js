const http = require('http');

let url = process.argv[2];

http.get(url.toString(), res => {
  res.on('data', chunk => {
    process.stdout.write(chunk.toString());
  });
});
