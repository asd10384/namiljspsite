
const express = require('express');
const mongoose = require('mongoose');
const crypto = require('crypto');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const router = express.Router();
const User = require('../modules/user');

const { getmeal } = require('./getmeal');

/* 페이지 이동 */
router.get('/', (req, res) => {
    res.render('index', {
    username: (req.user) ? req.user.username : '',
    });
});
router.get('/login', (req, res) => {
    if (req.user) {
        return res.send(`
            <script 'type=text/javascript'>
                alert('이미 로그인이 되어있습니다.');
                window.location='/';
            </script>
        `);
    } else {
        res.render('login', {
            username: (req.user) ? req.user.username : '',
            message: req.flash('login_message'),
        });
    }
});
router.get('/signup', (req, res) => {
    if (req.user) {
        return res.send(`
            <script 'type=text/javascript'>
                alert('이미 로그인이 되어있습니다.<br/>로그아웃하신 뒤 이용해주세요.');
                window.location='/';
            </script>
        `);
    } else {
        res.render('signup', {
            username: (req.user) ? req.user.username : '',
            page: 'signup',
        });
    }
});
router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});
router.get('/delete', function(req, res) {
    if (req.user) {
        User.findOneAndDelete({_id: req.user._id, id: req.user.id}, (err) => {
            if (err) {
                return res.send(`
                    <script 'type=text/javascript'>
                        alert('삭제할수 없습니다.');
                        window.location='/';
                    </script>
                `);
            }
            req.logout();
            return res.send(`
                <script 'type=text/javascript'>
                    alert('성공적으로 계정을 삭제했습니다.');
                    window.location='/';
                </script>
            `);
        });
    } else {
        return res.send(`
            <script 'type=text/javascript'>
                alert('먼저 로그인후 이용가능합니다.');
                window.location='/';
            </script>
        `);
    }
});
router.get('/myaccount', function(req, res) {
    if (req.user) {
        res.render('myaccount', {
            username: req.user.username,
            classnum: req.user.classnum,
            id: req.user.id,
        });
    } else {
        return res.send(`
            <script 'type=text/javascript'>
                alert('먼저 로그인후 이용해주세요.');
                window.location='/login';
            </script>
        `);
    }
});
router.get('/meal', async function(req, res) {
    return await getmeal(req, res);
});
router.get('/zoomid', function(req, res) {
    var classnum = (req.user) ? req.user.classnum[1] : 0;
    res.render('zoomid', {
        username: (req.user) ? req.user.username : '',
        classnum: classnum,
    });
});
/* 페이지 이동 끝 */

/* 로그인 */
// 라우터 처리
router.get('/login', (req, res) => {
    var msg;
    var errMSG = req.flash('error');
    if (errMSG) msg = errMSG;
    res.render('/login.ejs', {'message': msg});
});

// serialize 처리 해줘야함. (세션에 넣어줘야함)
passport.serializeUser(function(user, done) {
    done(null, user);
});
// 요청시 세션값 뽑아서 페이지 전달
passport.deserializeUser(function(user, done) {
    done(null, user);
});

// strategy 를 등록
// 인증처리는 여기서, db조회로식, post로들어오는것도 체크함
passport.use('local', new LocalStrategy({
    usernameField: 'id',
    passwordField: 'password',
    passReqToCallback: true,
}, function(req, id, password, done) {
    // 로그인 인증처리
    User.findOne({id: id}, function(err, user) {
        if (err) throw err;
        if (!user) return done(null, false, req.flash('login_message', '없는 아이디 입니다.'));
        User.findOne({id: id, password: crypto.createHash('sha512').update(password).digest('base64')}, function(err, user) {
            if (err) throw err;
            if (!user) return done(null, false, req.flash('login_message', '비밀번호가 틀렸습니다.'));
            return done(null, user); // 로그인 성공
        });
    });
}));

router.post('/login', passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: true
}), function(req, res) {
    res.redirect('/'); // 로그인 성공시 '/' 로 이동
});
/* 로그인 끝 */

/* 회원가입 */
router.post('/signup', (req, res, next) => {
    User.find({ id: req.body.id }).exec().then(u => {
        if (req.body.classnum.length < 4) {
            return res.send(`
                <script 'type=text/javascript'>
                    alert('올바른 학번을 적어주세요.<br/>(예: 1101)');
                    window.location='/signup';
                </script>
            `);
        }
        if (req.body.password.length < 6) {
            return res.send(`
                <script 'type=text/javascript'>
                    alert('비밀번호는 6자리 이상으로 해주세요.');
                    window.location='/signup';
                </script>
            `);
        }
        if (u.length >= 1) {
            return res.send(`
                <script 'type=text/javascript'>
                    alert('이미 존재하는 아이디입니다.');
                    window.location='/signup';
                </script>
            `);
        }
        const user = new User({
            _id: new mongoose.Types.ObjectId(),
            id: req.body.id,
            password: crypto.createHash('sha512').update(req.body.password).digest('base64'),
            classnum: req.body.classnum,
            username: req.body.username,
            email: `${req.body.id}@gmail.com`,
            userid: req.body.id,
        });
        user.save().then(result => {
            console.log(result);
            res.redirect('/login');
        }).catch(err => {
            console.log(err);
        });
    });
});
/* 회원가입 끝 */

module.exports = router;
