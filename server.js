const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const session = require('express-session');
let {PythonShell} = require('python-shell')

app.use(session({ secret: 'secretKey', resave: false, saveUninitialized: false }));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // Extracts JSON data and makes it easily readable

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // * restricts access to no one, might want to only match with registered users 
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'GET, POST');
    return res.status(200).json({ message: "I think this is working...line 48" });
  }
  next();
});

app.get('/', function(req, res) {
  res.send('home');
})

app.get('/test', function(req, res) {
  res.send('hello world!');
});

app.post('/upload', function(req, res) {
  let options = {
    pythonOptions: ['-u'], // get print results in real-time
  };

  PythonShell.run('parser.py', options).then(messages=>{
    console.log('finished!');
    console.log('results: %j', messages);
  });
  res.send('hello world2!');
});

var server = app.listen(3001, function (error) {
  if (error) {
    console.log('error stareting server', error)
  }
  var port = server.address().port;
  console.log('port', port);
  console.log('Listening at ' + port + ' exporting the directory ' + __dirname);
});
