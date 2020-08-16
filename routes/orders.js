const {Router} = require('express');
const router = new Router();

router.get('/', checkAuth, async (request, response) => {
    try {
        let orders = await Order.find({'user': request.user.id})
            .populate('user');

        // ;
        orders = orders.map(order => ({...order._doc, id: order._id, 
            price: order.courses.reduce( (total, c) => total += +c.course.price * +c.count, 0) 
        }));
        response.render('orders', {
            isOrders: true,
            title: 'Заказы',
            orders
        });
    } catch(err) {
        console.error(err);
    }
});

router.post('/', checkAuth, async (request, response) => {
    try {
        const user = await request.user
        .populate('cart.items.courseId')
        .execPopulate();

        const courses = user.cart.items.map(item => ({
            count: item.count,
            course: {...item.courseId._doc}
        }));

        const order = new Order({
            user: request.user.id,
            courses
        });

        await order.save();
        await request.user.clearCart();

        response.redirect('/orders');
    } catch(err) {
        console.error(err);
    }
});

module.exports = router;