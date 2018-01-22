const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// 连接远程 MongoDB
mongoose.connect('your-mongoosedb-connection-url', { useMongoClient: true });
mongoose.Promise = global.Promise;

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.set('view engine', 'ejs');

app.use(express.static('public'));

// Controllers
let HomeController = require('./controllers/HomeController');
let AdminController = require('./controllers/AdminController');
HomeController(app);
AdminController(app);

// see: http://www.expressjs.com.cn/starter/faq.html #如何处理 404 ？
app.use(function(req, res, next) {
  res.status(404).render('404');
});

app.listen(8000);
console.log('OK, server is listeing in port 8000.');
