const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        return next();
    }
    res.redirect('/auth/login');
};

const authorizeRole = (roles) => {
    return (req, res, next) => {
        if (!req.session.user) {
            return res.redirect('/auth/login');
        }
        if (roles.includes(req.session.user.userType)) {
            return next();
        }
        res.status(403).render('error', { message: 'Access Denied: You do not have permission to view this page.', error: {} });
    };
};

module.exports = { isAuthenticated, authorizeRole };
