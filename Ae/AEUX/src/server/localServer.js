const express = require('express');
const app = express();
const bodyParser = require('body-parser')

const port = 7240;

app.use((req, res, next) => {
//   res.setHeader('Content-Type', 'text/plain')
  // enable CORS
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'X-CUSTOM, Content-Type');
  next();
})

const jsonParser = bodyParser.json();
const textParser = bodyParser.text();

app.post('/', [jsonParser, textParser], (req, res) => {

  res.write(JSON.stringify(req.headers, null, 2))
  res.write('\n\n')

  const contentType = req.get('content-type');

//   if (contentType.includes('text/plain')) {
//     res.write(req.body)
//   }

  if (contentType.includes('application/json')) {
        var msgData = req.body;
        newVulcanMessage(msgData.func, msgData.data);
          
    res.write(JSON.stringify(req.body, null, 2))
  }

  res.end()

});

const server = app.listen(port, () => {
  const host = server.address().address;
  const port = server.address().port;
  console.log('App listening at http://%s:%s', host, port);
});

////////////////////////////////////////////
