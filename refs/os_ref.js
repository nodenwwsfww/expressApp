const os = require('os');

console.log( os.platform() ); // платформа
console.log( os.arch() ); // архитектура
console.log( os.cpus() ); // информация
console.log( os.freemem() ); // свободная память
console.log( os.totalmem() ); // общая память
console.log( os.homedir() ); // корневая директория
console.log( os.uptime() ); // текущий uptime системы (мс)