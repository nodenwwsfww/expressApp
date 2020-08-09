const {
    Router
} = require('express');
const router = Router();
const Course = require('../models/course');
const course = require('../models/course');

router.get('/', async (request, response) => {
    try {
        const courses = await Course.find({});
        response.render('courses', {
            title: 'Курсы',
            isCourses: true,
            courses
        });
        console.dir(courses);
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

router.get('/:id/edit', async (request, response) => {
    if (!request.query.allow) {
        return response.redirect('/');
    }
    
    try {
        const course = await Course.findById(request.params.id);

        response.render('course-edit', {
            title: `Редактировать ${course.title}`,
            course
        });
    } catch(err) {
        console.error(err);
    }
});

router.post('/edit', async (request, response) => {
    try {
        await Course.findOneAndUpdate({id: request.body.id}, request.body);
        response.redirect('/courses');
    } catch(err) {
        console.error(err);
    }
});
module.exports = router;