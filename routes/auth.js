const {
    Router, request
} = require('express');
const {
    Schema,
    Model
} = require('mongoose');
const router = Router();
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const nodemailer = require('nodemailer');
const sendgrid = require('nodemailer-sendgrid-transport');

const sendgridAPI = require('../keys').SENDGRID_API_KEY;
const transporter = nodemailer.createTransport(sendgrid({
    auth: {
        api_key: sendgridAPI
    }
}));
const regEmail = require('../emails/registration');
const resetEmail = require('../emails/reset');

// Validators
const { validationResult } = require('express-validator');
const {loginValidators, registerValidators} = require('../utils/validators');

router.get('/login', async (request, response) => {
    response.render('auth/login', {
        title: 'Авторизация',
        isLogin: true,
        loginError: request.flash('loginError'),
        registerError: request.flash('registerError')
    });
});

router.get('/logout', (request, response) => {
    request.session.destroy(() => {
        response.redirect('/auth/login#login');
    });
});

router.post('/login', loginValidators, async (request, response) => {
    try {
        const errors = validationResult(request);

        if (!errors.isEmpty()) {
            request.flash('loginError', errors.array()[0].msg);
            return response.redirect('/auth/login#login');
        }

        const {
            email,
            password
        } = request.body;
        const user = await User.findOne({
            email
        });

        const samePassword = user ? await bcrypt.compare(password, user.password) : false;

        if (!user || !samePassword) {
            request.flash('loginError', 'Неверный email или пароль');
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

router.post('/register', registerValidators, async (request, response) => {
    try {
        const {
            name,
            email,
            password,
            confirm
        } = request.body;

        const errors = validationResult(request);

        if (!errors.isEmpty()) {
            request.flash('registerError', errors.array()[0].msg);
            return response.status(422).redirect('/auth/login#register');
        }

        const candidate = await User.findOne({
            email
        });

        if (candidate) {
            request.flash('registerError', 'Пользователь с таким email уже существует');
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
            await transporter.sendMail(regEmail(email));

        }
    } catch (err) {
        console.error(err);
    }
});

router.get('/reset', (request, response) => {
    response.render('auth/reset', {
        title: 'Восстановление доступа',
        error: request.flash('error')
    });
});

router.post('/reset', (request, response) => {
    try {
        crypto.randomBytes(32, async (err, buffer) => {
            if (err) {
                response.flash('error', 'Что-то пошло не так, повторите попытку позже');
                return response.redirect('/auth/reset');
            }

            const {
                email
            } = request.body;
            const candidate = await User.findOne({
                email
            });

            if (candidate) {
                candidate.resetToken = buffer.toString('hex');
                candidate.resetTokenExp = Date.now() + 3600 * 1000; // час в мс
                await candidate.save();
                await transporter.sendMail(resetEmail());
                response.redirect('/auth/login');
            } else {
                request.flash('error', 'Пользователь с таким email не найден');
                return request.redirect('/auth/reset');

            }
        });

    } catch (err) {
        console.error();
    }

});

router.get('/reset-password/:token', async (request, response) => {
    try {
        const token = request.params.token;
        if (!token) {
            return response.redirect('/auth/login');
        }

        const user = await User.findOne({
            resetToken: token,
            resetTokenExp: {
                $gt: Date.now()
            }
        });

        if (user) {
            response.render('auth/reset-password', {
                title: 'Создание нового пароля',
                error: request.flash('error'),
                userId: user._id.toString(),
                token
            });
        } else {
            res.redirect('/auth/login');
        }
    } catch (error) {
        console.log(error);
    }
});

router.post('/reset-password/', async (request, response) => {
    try {
        const {
            userId: _id,
            token: resetToken,
            password
        } = request.body;

        const user = await User.findOne({
            _id,
            resetToken,
            resetTokenExp: {
                $gt: Date.now()
            }
        });
        
        if (user) {
            user.password = bcrypt.hash(password, 10);
            user.resetToken = null;
            user.resetTokenExp = null;
            await user.save();
        } else {
            request.flash('loginError', 'Время возможности восстановления истекло, попробуйте ещё раз');
        }

        response.redirect('/auth/login'); // redirect anyway

    } catch (error) {
        console.error(error);
    }
});

module.exports = router;