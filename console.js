/* Взаимодействие с консолью:
например при вызове приложения 'node console.js a=2 b=3
Мы обрабатываем параметры и вычисляем сумму 2 + 3 */
const consoleToJSON = () => {
    const c = {};
    for (let i = 2; i < process.argv.length; i++) {
        const [key, value] = item.split('=');
        c[key] = value ? value : true;
    }
    return c;
};
const calc = () => {
    const r = eval(process.argv[2].trim());
    return r;
};
console.log( calc() );