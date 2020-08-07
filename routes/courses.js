const {
    Router
} = require('express');
const router = Router();
const Course = require('../models/course');

router.get('/', async (request, response) => {
    const courses = await Course.getAll();
    response.render('courses', {
        title: 'Курсы',
        isCourses: true,
        courses
    });
});

router.get('/:id/', async (request, response) => {
    const course = await Course.getById(request.params.id);
    if (course !== -1) {
        response.render('course', {
            layout: 'empty',
            title: `Курс ${course.title}`,
            course
        });
    } else {
        console.error('Ошибка & Курс не найден');
    }
});

router.get('/:id/edit', async (request, response) => {
    if (!request.query.allow) {
        return response.redirect('/');
    }
    
    const course = await Course.getById(request.params.id);

    response.render('course-edit', {
        title: `Редактировать ${course.title}`,
        course
    });
});

router.post('/edit', async (request, response) => {
    console.log(request.body);
    await Course.update(request.body);
    response.redirect('/courses');
});
module.exports = router;