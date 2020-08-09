const {Schema, model} = require('mongoose');

const course = new Schema({
    title: {
        type: String,
        required: true, // обязателен (могут возникать ошибки при отсутствии)
        default: 'None'
    },
    price: {
        type: Number,
        required: true, // обязателен (могут возникать ошибки при отсутствии)
        default: 10000
    },
    img: String
});

module.exports = model('Course', course);