module.exports = async function(request, response, next) {
    if (request.session.user) {
        request.user = await User.findById(request.session.user._id);
    }
    next();
}