const {Schema, model} = require('mongoose');

const courseSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
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
    img: String,
});

module.exports = model('Course', courseSchema);