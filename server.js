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

app.post('/test2', function(req, res) {
  // console.log(req.)
  PythonShell.run('parser.py', null).then(messages=>{
    console.log('finished!');
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

// const http = require('http');

// const hostname = '127.0.0.1';
// const port = 3001;

// const server = http.createServer((req, res) => {
//   res.statusCode = 200;
//   res.setHeader('Content-Type', 'text/plain');
//   res.end('Hello World');
// });

// server.listen(port, hostname, () => {
//   console.log(`Server running at http://${hostname}:${port}/`);
// });




// const http = require('http');
// const express = require('express');
// const app = express();
// const morgan = require('morgan');
// const bodyParser = require('body-parser');
// const mongoose = require('mongoose');
// const path = require('path');
// const applyRoutes = require('./api/routes/apply');
// const userRoutes = require('./api/routes/user');
// const authenticationRoutes = require('./api/routes/authentication');
// const session = require('express-session');
// const envPort = process.env.PORT || 3001;

// console.log("port", envPort);

// console.log("node env", process.env.NODE_ENV);

// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname, 'build')));
// }

// app.use(session({ secret: 'secretKey', resave: false, saveUninitialized: false }));
// app.use(morgan('dev'));
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json()); // Extracts JSON data and makes it easily readable

// mongoose.connect('mongodb+srv://ianlim:' + process.env.MONGO_ATLAS_PW + '@node-rest-apply.q1m9b.mongodb.net/rootDatabase?retryWrites=true&w=majority', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// })
//   .then(() => { console.log('successful connection to mongoose') })
//   .catch((error) => {
//     console.log('mongoose error', error, process.env.MONGO_ATLAS_PW);
//   })

// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', '*'); // * restricts access to no one, might want to only match with registered users 
//   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
//   if (req.method === 'OPTIONS') {
//     res.header('Access-Control-Allow-Methods', 'GET, POST');
//     return res.status(200).json({ message: "I think this is working...line 48" });
//   }
//   next();
// })

// app.use('/apply', applyRoutes);
// app.use('/authentication', authenticationRoutes);
// app.use('/user', userRoutes);

// if (process.env.NODE_ENV === "production") {
//   app.get('*', (req, res) => {
//     res.sendFile(path.resolve(__dirname, "build", "index.html"), function (err) {
//       console.log('sent to dir');
//       if (err) {
//         console.log('error getting dir path', err);
//         res.status(500).send(err)
//       } else {
//         console.log('hello this is working??');
//       }
//     })
//   })
// } else {
//   app.get('*', (req, res) => {
//     res.sendFile(path.resolve("public/index.html"), function (err) {
//       console.log('sent to public/index.html');
//       if (err) {
//         console.log('error getting dir path', err);
//         res.status(500).send(err)
//       } else {
//         console.log('hello this is working??');
//       }
//     })
//   })
// }

// app.use((req, res, next) => {
//   const error = new Error('Route not found');
//   error.status = 404;
//   next(error);
// })

// // Returning errors here from errors coming from elsewhere in app
// app.use((error, req, res, next) => {
//   res.status(error.status || 500);
//   res.json({
//     error: {
//       message: error.message
//     }
//   })
// })

// var server = app.listen(envPort, function (error) {
//   if (error) {
//     console.log('error stareting server', error)
//   }
//   var port = server.address().port;
//   console.log('port', port);
//   console.log('Listening at ' + port + ' exporting the directory ' + __dirname);
// });