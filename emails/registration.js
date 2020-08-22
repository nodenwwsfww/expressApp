const from = require('../keys').EMAIL_FROM;
const siteRef = require('../keys').BASE_URL;

module.exports = function(to) {
    return {
        to,
        from,
        subject: 'Регистрация нового пользователя',
        html: `
            <h1>Поздравляем с успешной регистрацией!</h1>
            <p>Аккаунт успешно создан</p>
            <hr />
            <a href="${siteRef}">Перейти в магазин</a>
        `
    };
}