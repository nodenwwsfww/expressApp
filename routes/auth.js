const {Router} = require('express');
const router = Router();

router.get('/login', async (request, response) => {
    response.render('auth/login', {
        title: 'Авторизация',
        isLogin: true
    });
});
router.get('/logout', (request, response) => {
    request.session.destroy(() => {
        response.redirect('auth/login/#login');
    });

});

router.post('/login', async (request, response) => {
    const user = await User.findById('5f365b6b0bfdc6465c7c056a');
    request.user = user;
    console.log(request.user);
    request.session.isAuthenticated = true;
    request.session.user = user;
    request.session.save(err => {
        if (err) throw err;
        response.redirect('/');
    });
});

module.exports = router;