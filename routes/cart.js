const {Router} = require('express');
const router = new Router();

function mapCartItems(cart) {

    return cart.items.map(item => ({...item.courseId._doc, count: item.count, id: item.courseId.id}));
}

function computePrice(courses) {
    return courses.reduce( (total, item) => total += item.price * item.count, 0);
}

router.post('/add', async (request, response) => {
    try {
        const course = await Course.findById(request.body.id);
        request.user.addToCart(course);
        response.redirect('/cart');
    } catch(err) {
        console.error(err);
    }
});

router.delete('/remove/:id', async (request, response) => {
    try {
        await request.user.removeInCart(request.params.id);

        const user = await request.user
            .populate('cart.items.courseId')
            .execPopulate();
    
        const courses = mapCartItems(user.cart);
        const cart = {
            courses,
            price: computePrice(courses)
        };
        response.status(200).json(cart);
    } catch(err) {
        console.error(err);
    }

});

router.get('/', async (request, response) => {
    try {
        const user = await request.user
        .populate('cart.items.courseId')
        .execPopulate();

        const courses = mapCartItems(user.cart);
        response.render('cart', {
            title: 'Корзина',
            courses: courses,
            price: computePrice(courses),
            isCart: true
        });
    } catch(err) {
        console.error(err);
    }
});
module.exports = router;