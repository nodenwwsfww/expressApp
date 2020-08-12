const {Schema, model} = require('mongoose');

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    cart: {
        items: [
            {
                courseId: {
                    type: Schema.Types.ObjectId,
                    ref: 'Course', /* Связываем с моделью курс */
                    required: true
                },
                name: {
                    type: String,
                    required: true
                },
                count: {
                    type: Number,
                    required: true,
                    default: 1
                }
            }
        ]

    }
});

module.exports = model('User', userSchema);