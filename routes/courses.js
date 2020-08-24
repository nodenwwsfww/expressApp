const {
    Router, request
} = require('express');
const router = Router();

function isOwner(course, request) {
    return request.user._id.toString() === course.userId.toString();
}

router.get('/', async (request, response) => {
    try {
        const courses = await Course.find()
        .populate('userId', 'email name');

        response.render('courses', {
            title: 'Курсы',
            isCourses: true,
            userId: request.user ? request.user._id.toString() : null,
            courses
        });
    } catch(err) {
        console.error(err);
    }
});

router.get('/:id/', async (request, response) => {
    try {
        const course = await Course.findById(request.params.id);
        response.render('course', {
            layout: 'empty',
            title: `Курс ${course.title}`,
            course
        });
    } catch(err) {
        console.error(err);
    }
});

router.get('/:id/edit', checkAuth, async (request, response) => {
    if (!request.query.allow) {
        return response.redirect('/');
    }
    try {
        const course = await Course.findById(request.params.id);

        if (!isOwner(course, request)) {
            request.query.allow = !request.query.allow;
            return response.redirect('/');
        }

        response.render('course-edit', {
            title: `Редактировать ${course.title}`,
            course
        });
    } catch(err) {
        console.error(err);
    }
});

router.post('/edit', checkAuth, async (request, response) => {
    try {
        const {id} = request.body;
        const course = await Course.findById(id);

        if (!course) return response.redirect('/');
        if (!isOwner(course, request)) {
            return response.redirect('/');
        }
        delete request.body.id;

        Object.assign(course, request.body);
        await course.save();
        response.redirect('/courses');
    } catch(err) {
        console.error(err);
    }
});

router.post('/remove', checkAuth, async (request, response) => {
    try {
        await Course.deleteOne({
            _id: request.body.id,
            userId: request.user._id
        });
        response.redirect('/courses');
    } catch(err) {
        console.error(err);
    }
});

module.exports = router;