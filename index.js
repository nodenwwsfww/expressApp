const path = require('path');
const mongoose = require('mongoose');
const Handlebars = require('handlebars')
const express = require('express');
const exphbs = require('express-handlebars');
const session = require('express-session');
const MongoStore = require('connect-mongodb-session')(session);

/* Global Models */
const User = require('./models/user');
const Course = require('./models/course');
const Order = require('./models/order');
/*  */

const varMiddleWare = require('./middleware/variables');
const userMiddleWare = require('./middleware/user');
const checkAuth = require('./middleware/auth');


const homeRoutes = require('./routes/home');
const addRoutes = require('./routes/add');
const coursesRoutes = require('./routes/courses');
const cartRoutes = require('./routes/cart');
const ordersRoutes = require('./routes/orders');
const authRoutes = require('./routes/auth');

const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
const app = express();

const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs',
    handlebars: allowInsecurePrototypeAccess(Handlebars)
});

const password = '4wLwiA26Gs9Eoqnl'; // edit
const MONGODB_URI = `mongodb+srv://nwwsfww:${password}@cluster0.xe1qk.mongodb.net/shop`;

const store = new MongoStore({
    collection: 'sessions',
    uri: MONGODB_URI
});


app.engine('hbs', hbs.engine, {});
app.set('view engine', 'hbs');
app.set('views', 'views');

app.use(express.static( path.join(__dirname, 'public') ));
app.use(express.urlencoded({extended: true}));
app.use(session({
    secret: 'some secret value',
    resave: false,
    saveUninitialized: false,
    store
}));
app.use(varMiddleWare);
app.use(userMiddleWare);

app.use('/', homeRoutes);
app.use('/add', addRoutes);
app.use('/courses', coursesRoutes);
app.use('/cart', cartRoutes);
app.use('/orders', ordersRoutes);
app.use('/auth', authRoutes);


const PORT = process.env.PORT || 3000;

const start = async () => {
    try {
        await mongoose.connect(MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch(err) {
        console.error(err);
    }
};
start();