const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const session = require('express-session');
let { PythonShell } = require('python-shell');
const multer = require('multer');
const upload = multer();
const fs = require('fs');

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

app.post('/upload', upload.single('file'), function(req, res) {
  const file = req.file;

  let options = {
    pythonOptions: ['-u'], // get print results in real-time
  };

  fs.writeFileSync("./data/upload.pdf", file.buffer);

  PythonShell.run('chatgpt_parser.py', options).then(messages => {
    console.log('results: %j', messages);
    console.log('name: ', messages[0].split(':')[1])
    console.log('tests: ', messages[1].split(':')[1])
    console.log('medicine', messages[2].split(':')[1])
    console.log('delivery_address: ', messages[3].split(':')[1])
    console.log('delivery lat, long, alt: ', messages[4].split('*')[1])
    console.log('launch_address: ', messages[5].split(':')[1])
    console.log('launch lat, long, alt: ', messages[6].split('*')[1])

    let data = {
      patientName: messages[0].split(':')[1],
      tests: messages[1].split(':')[1],
      prescriptions: messages[2].split(':')[1],
      deliveryAddress: messages[3].split(':')[1],
      deliveryInfo: messages[4].split('*')[1],
      launchAddress: messages[5].split(':')[1],
      launchInfo: messages[6].split('*')[1]
    }
    res.end(JSON.stringify(data));
  });
});

var server = app.listen(3001, function (error) {
  if (error) {
    console.log('error stareting server', error)
  }
  var port = server.address().port;
  console.log('port', port);
  console.log('Listening at ' + port + ' exporting the directory ' + __dirname);
});
