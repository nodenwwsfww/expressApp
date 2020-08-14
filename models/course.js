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
/* courseSchema.method('toClient', function() {
    const course = this.toObject();
    course.id = course._id;
    delete course._id;
    return course;
}); */

global.Course = model('Course', courseSchema);
module.exports = Course;