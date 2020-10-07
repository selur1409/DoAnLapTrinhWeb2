const express = require('express');
const passport = require('passport');
const accountModel = require('../models/account.model');
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
  req.flash('error', 'Đăng nhập thất bại.');
  return res.redirect('/account/login');
})

// In this route you can see that if the user is logged in u can acess his info in: req.user
router.get('/good', isLoggedIn, async function(req, res){
  const verifed = req.user.emails[0].hasOwnProperty('verified') ? req.user.emails[0].verified : true;
  if (verifed !== true){
    req.flash('error', 'Email chưa được xác thực.');
    return res.redirect('/account/login');
  }

  const checkGoogle = await accountModel.singleGoogle_check(req.user.id);
  const checkFacebook = await accountModel.singleFacebook_check(req.user.id);
  if (checkGoogle.length === 0 && checkFacebook.length === 0){
    // Lấy ngày giờ hiện tại
    const dt_now = moment().format('YYYY-MM-DD');
    const entityAccount = {
      Username: req.user.id,
      DateRegister: dt_now,
      TypeAccount: 1,
      IsGoogle: req.user.provider === 'google' ? 1 : 0,
      IsFacebook: req.user.provider === 'facebook' ? 1 : 0,
      IsDelete: 0
    }
    await accountModel.add(entityAccount);

    const accountGoogle = await accountModel.singleGoogle_check(entityAccount.Username);
    const accountFacebook = await accountModel.singleFacebook_check(entityAccount.Username);

    if (accountGoogle.length === 0 && accountFacebook.length === 0){
      req.flash('error', 'Thêm tài khoản không thành công');
      return res.redirect('/account/login');
    }

    const idAccount = accountGoogle.length === 0 ? accountFacebook[0].Id : accountGoogle[0].Id;

    //Khởi tạo ngày sinh mặc định
    const dob = '1990/01/01';
    //Khởi tạo giới tính mặc định
    const sex = 0;

    const entityInfomation = {
      Name: req.user.displayName,
      Email: req.user.emails[0].value,
      Avatar: accountGoogle.length === 0 ? `https://graph.facebook.com/${req.user.id}/picture?type=large`: req.user._json.picture,
      DOB: dob,
      IdAccount: idAccount,
      Sex: sex
    }
    await accountModel.addInfor(entityInfomation);
  }

  const accountGoogleExists = await accountModel.singleGoogle(req.user.id);
  const accountFacebookExists = await accountModel.singleFacebook(req.user.id);
  if (accountGoogleExists.length === 0 && accountFacebookExists.length === 0){
    req.flash('error', 'Email không tồn tại.');
    return res.redirect('/account/login');
  }

  const acc = req.user.provider === 'google' ? accountGoogleExists[0] : accountFacebookExists[0];

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

// Auth Routes Google
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email'], 
  prompt : "select_account" }));

router.get('/google/callback', passport.authenticate('google', { 
    failureRedirect: '/auth/popup', 
    successRedirect: '/auth/popup' 
  })
);

//Auth Routes Facebook
router.get('/facebook', passport.authenticate('facebook', {
  scope:['public_profile', 'email']
}));

router.get('/facebook/callback', 
  passport.authenticate('facebook', {
    successRedirect:'/auth/popup',
    failureRedirect:'/auth/popup'
  })
);

router.get('/popup', (req, res, next) =>{
  res.render('auth.hbs', {layout:false});
});

router.get('/logout', (req, res) => {
    req.session = null;
    req.logout();
    res.redirect('/');
})
module.exports = router;