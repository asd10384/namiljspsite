
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const Route = require('./js/main');

app.use(bodyParser.urlencoded({extended : true}));

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs'); //ejs 템플릿 엔진  연동 

app.use('/', Route);

app.listen(80, function() {
     console.log('http://localhost');
});
