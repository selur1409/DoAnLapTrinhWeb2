const querystring = require('querystring');

const restrict = function (req, res, next) {
    if (!req.session.isAuthenticated) {
        const url = querystring.escape(req.originalUrl);
        return res.redirect(`/`);
    }
    next();
}

const referer = function (req, res, next){
    if (req.session.isAuthenticated){
        return res.redirect('/');
    }
    next();
}

const isAdmin = function(req, res, next){
    if (!res.locals.lcIsAdmin){
        return res.redirect('/');
    }
    next();
}

module.exports = {
    restrict,
    referer,
    isAdmin
};