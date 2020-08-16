global.checkAuth = function(request, response, next) {
    if (!request.session.isAuthenticated) {
        return response.redirect('/auth/login');
    }
    next();
}

module.exports = checkAuth;