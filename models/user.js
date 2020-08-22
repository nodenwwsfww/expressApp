const {Schema, model} = require('mongoose');

const userSchema = new Schema({
    name: String,
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    resetToken: String,
    resetTokenExp: Date,
    cart: {
        items: [
            {
                courseId: {
                    type: Schema.Types.ObjectId,
                    ref: 'Course', /* Связываем с моделью курс */
                    required: true
                },
                count: {
                    type: Number,
                    required: true,
                    default: 1
                }
            }
        ],

    }
});

userSchema.methods.addToCart = async function(course) {
    const items = [...this.cart.items];
    const idx = items.findIndex(item => item.courseId.toString() === course.id.toString());
    const item = items[idx];

    if (item) item.count++;
    else {
        items.push({
            courseId: course._id,
            count: 1
        });
    }
    this.cart = {items};
    return this.save();
}
userSchema.methods.removeInCart = async function(courseId) {
    const items = [...this.cart.items];
    const idx = items.findIndex(item => item.courseId.toString() === courseId.toString());

    const item = items[idx];

    if (item) {
        if (item.count > 1) item.count--;
        else items.splice(idx, 1);
        this.cart = {items};
        return this.save();
    }
    return Promise.reject('Invalid courseId');
}
userSchema.methods.clearCart = async function() {
    this.cart = {};
    return this.save();
}

global.User = model('User', userSchema);
module.exports = User;