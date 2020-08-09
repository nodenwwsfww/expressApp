const {Router} = require('express');
const router = new Router();
const Card = require('../models/card');
const Course = require('../models/course');

router.post('/add', async (request, response) => {
    const course = await Course.findById(request.body.id);
    await Card.add(course);
    response.redirect('/card');
});

router.delete('/remove/:id', async (request, response) => {
    const card = await Card.remove(request.params.id);
    response.status(200).json(card);
});

router.get('/', async (request, response) => {
    const card = await Card.fetch();
    response.render('card', {
        title: 'Корзина',
        courses: card.courses,
        price: card.price,
        isCard: true
    });
});
module.exports = router;