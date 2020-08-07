const fs = require('fs');
const path = require('path');

const generatedPath = path.join(
    path.dirname(process.mainModule.filename),
    'data/card.json'
);
class Card {

    static async add(course) {
        const card = await Card.fetch();
        const idx = card.courses.findIndex( c => c.id === course.id);
        const matchedCourse = card.courses[idx];

        if (matchedCourse) {
            // Если есть совпадение
            matchedCourse.count++;
            card.courses[idx] = matchedCourse;
        } else {
            course.count = 1;
            card.courses.push(course);
        }
        card.price += +course.price;

        await Card.saveAll(card);
    }
    static async remove(id) {
        const card = await Card.fetch();
        const idx = card.courses.findIndex(course => course.id === id);
        const course = card.courses[idx];

        if (course) {
            course.count--;
            card.price -= course.price;
            if (course.count <= 0) {
                /* Удаляем, если закончились (count) */
                card.courses.splice(idx, 1);
            }
            /* Обновляем базу данных */
            await Card.saveAll(card);
        } else {
            console.error('Ошибка & Курс не найден в \'card.json\'');
        }
        return card;
    }
    static saveAll(card) {
        return new Promise( (resolve, reject) => {
            fs.writeFile(generatedPath, JSON.stringify(card), err => {
                if (err) reject(err);
                else resolve();
            })
        });
    }
    static async fetch() {
        return new Promise( (resolve, reject) => fs.readFile(generatedPath, { encoding: 'utf-8' }, (err, data) => {
            if (err) reject(err);
            else resolve( JSON.parse(data) );
        }));
    }
}

module.exports = Card;