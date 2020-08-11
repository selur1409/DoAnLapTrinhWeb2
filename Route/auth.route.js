const express = require('express');
const passport = require('passport');
const accountModel = require('../Models/account.model');
const moment = require('moment');
const router = express.Router();
// Auth middleware that checks if the user is logged in
const isLoggedIn = (req, res, next) => {
  if (!req.user) {
    return res.sendStatus(401);
  }
  next();
}

router.get('/failed', function(req, res){
  req.flash('error', 'Đăng nhập google+ thất bại.');
  return res.redirect('/account/login');
})

// In this route you can see that if the user is logged in u can acess his info in: req.user
router.get('/good', isLoggedIn, async function(req, res){
  const verifed = req.user.emails[0].verified;
  if (verifed !== true){
    req.flash('error', 'Email chưa được xác thực.');
    return res.redirect('/account/login');
  }

  const check = await accountModel.singleGoogle_check(req.user.id);
  if (check.length === 0){
    // Lấy ngày giờ hiện tại
    const dt_now = moment().format('YYYY-MM-DD');
    const entityAccount = {
      Username: req.user.id,
      DateRegister: dt_now,
      TypeAccount: 1,
      IsGoogle: 1,
      IsDelete: 0
    }
    await accountModel.add(entityAccount);

    const account = await accountModel.singleGoogle_check(entityAccount.Username);
    if (account.length === 0){
      req.flash('error', 'Thêm tài khoản Google không thành công');
      return res.redirect('/account/login');
    }

    const idAccount = account[0].Id;

    //Khởi tạo ngày sinh mặc định
    const dob = '1990/01/01';
    //Khởi tạo giới tính mặc định
    const sex = 0;

    const entityInfomation = {
      Name: req.user.displayName,
      Email: req.user.emails[0].value,
      Avatar: req.user.photos[0].value,
      DOB: dob,
      IdAccount: idAccount,
      Sex: sex
    }
    await accountModel.addInfor(entityInfomation);
  }

  const rows = await accountModel.singleGoogle(req.user.id);
  if (rows.length === 0){
    req.flash('error', 'Email không tồn tại.');
    return res.redirect('/account/login');
  }

  const acc = rows[0];

  if (acc.Avatar)
  {
    if (acc.Avatar.indexOf("https://") !== -1){
      acc.isGg = true;
    }
  }
  
  if (acc.DateExpired){
    acc.DateExpired = moment(acc.DateExpired, 'YYYY-MM-DD HH:mm:ss').format('DD-MM-YYYY HH:mm:ss');
  }
  acc.DOB = moment(acc.DOB, 'YYYY-MM-DD').format('DD-MM-YYYY');
  
  req.session.isAuthenticated = true;
  req.session.authAccount = acc;
  req.session.isSubscriber = true;
  
  const url = req.query.retUrl || '/';
  return res.redirect(url);
})

// Auth Routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/auth/failed' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/auth/good');
  }
);

router.get('/logout', (req, res) => {
    req.session = null;
    req.logout();
    res.redirect('/');
})
module.exports = router;