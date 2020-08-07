const {v4: uuid} = require('uuid');
const fs = require('fs');
const path = require('path');
const {
    dirname
} = require('path');

class Course {
    constructor(title, price, img) {
        this.title = title;
        this.price = price;
        this.img = img;
        this.id = uuid();
    }

    static async update (course) {
        const courses = await Course.getAll();
        const index = courses.findIndex(c => c.id === course.id);

        if (index !== -1) {
            courses[index] = course;
            Course.saveAll(courses);
        } else {
            console.error('Ошибка & обновление информации о курсе');
        }
        

    }

    async save() {
        /* Сохраняет курс в data/courses.json */
        const courses = await Course.getAll();
        const newCourse = {
            title: this.title,
            price: this.price,
            img: this.img,
            id: this.id,
        };
        courses.push(newCourse);
        return Course.saveAll(courses);
    }
    
    static async saveAll(courses) {
        try {
            return new Promise((resolve, reject) => fs.writeFile(path.join(__dirname, '..', 'data/courses.json'), JSON.stringify(courses), (err) => {
                if (err) reject(err);
                else resolve();
            }));
        } catch (err) {
            console.error(err);
        }
    }

    static getAll() {
        try {
            return new Promise((resolve, reject) => fs.readFile(path.join(__dirname, '..', '/data/courses.json'), {
                encoding: 'utf-8'
            }, (err, data) => {
                if (err) reject(err);
                else resolve(JSON.parse(data));
            }));
        } catch(err) {
            console.err(err);
        }
    }
    
    static async getById(id) {
        const courses = await Course.getAll();
        return courses.find(course => course.id === id);
    }
}
module.exports = Course;