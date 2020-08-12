const {Router} = require('express');
const router = new Router();
const Cart = require('../models/cart');
const Course = require('../models/course');

router.post('/add', async (request, response) => {
    const course = await Course.findById(request.body.id);
    await Cart.add(course);
    response.redirect('/cart');
});

router.delete('/remove/:id', async (request, response) => {
    const cart = await Cart.remove(request.params.id);
    response.status(200).json(cart);
});

router.get('/', async (request, response) => {
    const cart = await Cart.fetch();
    response.render('cart', {
        title: 'Корзина',
        courses: cart.courses,
        price: cart.price,
        isCart: true
    });
});
module.exports = router;