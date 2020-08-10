const path = require('path');
const mongoose = require('mongoose');
const Handlebars = require('handlebars')
const express = require('express');
const exphbs = require('express-handlebars');

const homeRoutes = require('./routes/home');
const addRoutes = require('./routes/add');
const coursesRoutes = require('./routes/courses');
const cardRoutes = require('./routes/card');
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

app.use(express.static( path.join(__dirname, 'public') ));
app.use(express.urlencoded({extended: true}));


app.use('/', homeRoutes);
app.use('/add', addRoutes);
app.use('/courses', coursesRoutes);
app.use('/card', cardRoutes);
const PORT = process.env.PORT || 3000;

const start = async () => {
    try {
        const password = '4wLwiA26Gs9Eoqnl'; // edit
        const url = `mongodb+srv://nwwsfww:${password}@cluster0.xe1qk.mongodb.net/shop`;
    
        await mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch(err) {
        console.error(err);
    }
};
start();