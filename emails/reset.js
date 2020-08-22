const from = require('../keys').EMAIL_FROM;
const siteRef = require('../keys').BASE_URL;

module.exports = function(to, token) {
    return {
        to,
        from,
        subject: 'Восстановление доступа',
        html: `
            <h1>Здравствуйте!</h1>
            Кто-то пытается сбросить ваш пароль. Если это Вы, то перейдите по ссылке ниже
            <hr />
            <a href="${siteRef}/auth/reset-password${token}">Восстановить доступ</a>
        `
    };
}