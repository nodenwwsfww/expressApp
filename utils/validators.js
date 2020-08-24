const {body} = require('express-validator');

exports.registerValidators = [
    body('email').isEmail().withMessage('Некорректный email'),
    body('password','Пароль должен состоять из символов латинского алфавита и иметь длину от 6 до 64 символов').isLength({min: 6, max: 64}).isAlphanumeric(),
    body('name').isLength({min: 3}).withMessage('Имя должно состоять минимум из 3 символов'),
    body('confirm').custom((value, {req}) => {
        if (value !== req.body.password) {
            throw new Error('Пароли должны совпадать');
        }
        return true;
    }),
];

exports.loginValidators = [
    body('email').isEmail().withMessage('Некорректный email'),
    body('password', 'Пароль должен состоять из символов латинского алфавита и иметь длину от 6 до 64 символов').isLength({min: 6, max: 64}).isAlphanumeric(),
];