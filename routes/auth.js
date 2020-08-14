const {Router} = require('express');
const router = Router();

router.get('/login', async (request, response) => {
    response.render('auth/login', {
        title: 'Авторизация',
        isLogin: true
    });
});

module.exports = router;