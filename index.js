
// https://miryang.dev/2019/04/25/nodejs-page-3/

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Session = require('express-session');
const flash = require('connect-flash');
var MongoDBStore = require('connect-mongodb-session')(Session);

const app = express();
const Route = require('./routes/main');
const { mongoose_url } = require('./config.json');

const PORT = process.env.PORT || 10384;
const URL = process.env.MONGO_URL || mongoose_url;

mongoose.connect(URL, {
     useNewUrlParser: true,
     useUnifiedTopology: true
});

app.use(flash());

// 세션
var store = new MongoDBStore({ //세션을 저장할 공간
     uri: mongoose_url, //db url
     collection: 'sessions' //콜렉션 이름
});

store.on('error', function(error) {
     console.log(error);
});

app.use(Session({
     secret: 'namilsite', //세션 암호화 key
     resave: false, //세션 재저장 여부
     saveUninitialized: true,
     rolling: true, //로그인 상태에서 페이지 이동 시마다 세션값 변경 여부
     cookie: {maxAge: 1000 * 60 * 60}, //유효시간
     store: store
}));
app.use(passport.initialize());
app.use(passport.session());

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(bodyParser.urlencoded({extended : true})); 

app.use(express.static(__dirname + '/'));
app.use('/', Route);

app.listen(PORT, function() {
     console.log('http://localhost:' + PORT);
});
