const {
    Router
} = require('express');
const { Schema, Model } = require('mongoose');
const router = Router();
const bcrypt = require('bcryptjs');

router.get('/login', async (request, response) => {
    response.render('auth/login', {
        title: 'Авторизация',
        isLogin: true
    });
});
router.get('/logout', (request, response) => {
    request.session.destroy(() => {
        response.redirect('/auth/login#login');
    });
});

router.post('/login', async (request, response) => {
    try {
        const {email, password} = request.body;

        const user = await User.findOne({email});

        const samePassword = await bcrypt.compare(password, user.password);

        if (!user || !samePassword) {
            response.redirect('/auth/login#login');
        } else {
            request.session.user = user;
            request.session.isAuthenticated = true;
            request.session.save(err => {
                if (err) throw err;
                response.redirect('/');
            });
        }
    } catch (err) {
        console.error(err);
    }
});

router.post('/register', async (request, response) => {
    try {
        const {
            name,
            email,
            password,
            confirm
        } = request.body;

        const candidate = await User.findOne({
            email
        });

        if (candidate) {
            response.redirect('/auth/login#register');
        } else {
            const hashPassword = await bcrypt.hash(password, 10);
            const user = new User({
                name,
                email,
                password: hashPassword,
                cart: {
                    items: []
                }
            });

            await user.save();
            response.redirect('/auth/login#login');

        }
    } catch (err) {
        console.error(err);
    }
});
module.exports = router;