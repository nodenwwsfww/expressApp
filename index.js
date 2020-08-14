const path = require('path');
const mongoose = require('mongoose');
const Handlebars = require('handlebars')
const express = require('express');
const exphbs = require('express-handlebars');

/* Global Models */
const User = require('./models/user');
const Course = require('./models/course');
const Order = require('./models/order');
/*  */

const homeRoutes = require('./routes/home');
const addRoutes = require('./routes/add');
const coursesRoutes = require('./routes/courses');
const cartRoutes = require('./routes/cart');
const ordersRoutes = require('./routes/orders');

const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
const app = express();

const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs',
    handlebars: allowInsecurePrototypeAccess(Handlebars)
});
app.engine('hbs', hbs.engine, {});
app.set('view engine', 'hbs');
app.set('views', 'views');

app.use( async (request, response, next) => {
    try {
        const user = await User.findById('5f365b6b0bfdc6465c7c056a');
        request.user = user;
        next();
    } catch(err) {
        console.error(err);
    }
});

app.use(express.static( path.join(__dirname, 'public') ));
app.use(express.urlencoded({extended: true}));


app.use('/', homeRoutes);
app.use('/add', addRoutes);
app.use('/courses', coursesRoutes);
app.use('/cart', cartRoutes);
app.use('/orders', ordersRoutes);


const PORT = process.env.PORT || 3000;

const start = async () => {
    try {
        const password = '4wLwiA26Gs9Eoqnl'; // edit
        const url = `mongodb+srv://nwwsfww:${password}@cluster0.xe1qk.mongodb.net/shop`;
    
        await mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});

        const candidate = await User.findOne();
        if (!candidate) {
            await User.create(new User({
                email: 'nodenwwsfww@gmail.com',
                name: 'Roman Radchenko',
                cart: {items: []}
            }));
        }

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch(err) {
        console.error(err);
    }
};
start();