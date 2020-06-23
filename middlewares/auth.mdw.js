

const restrict = function (req, res, next) {
    if (!req.session.isAuthenticated) {
        return res.redirect(`/account/login?retUrl=${req.originalUrl}`);
    }

    next();
}

const referer = function (req, res, next){
    if (req.session.isAuthenticated){
        return res.redirect('/');
    }
    next();
}

module.exports = {
    restrict,
    referer
};