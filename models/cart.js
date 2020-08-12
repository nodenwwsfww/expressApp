const fs = require('fs');
const path = require('path');

const generatedPath = path.join(
    path.dirname(process.mainModule.filename),
    'data/cart.json'
);
class Cart {

    static async add(course) {
        const cart = await Cart.fetch();
        const idx = cart.courses.findIndex( c => c.id === course.id);
        const matchedCourse = cart.courses[idx];

        if (matchedCourse) {
            // Если есть совпадение
            matchedCourse.count++;
            cart.courses[idx] = matchedCourse;
        } else {
            course.count = 1;
            cart.courses.push(course);
        }
        cart.price += +course.price;

        await Cart.saveAll(cart);
    }
    static async remove(id) {
        const cart = await Cart.fetch();
        const idx = cart.courses.findIndex(course => course.id === id);
        const course = cart.courses[idx];

        if (course) {
            course.count--;
            cart.price -= course.price;
            if (course.count <= 0) {
                /* Удаляем, если закончились (count) */
                cart.courses.splice(idx, 1);
            }
            /* Обновляем базу данных */
            await Cart.saveAll(cart);
        } else {
            console.error('Ошибка & Курс не найден в \'cart.json\'');
        }
        return cart;
    }
    static saveAll(cart) {
        return new Promise( (resolve, reject) => {
            fs.writeFile(generatedPath, JSON.stringify(cart), err => {
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

module.exports = Cart;