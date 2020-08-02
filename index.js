const http = require('http');
const fs = require('fs');
const path = require('path');
const server = http.createServer((request, response) => {
    if (request.method === 'GET') {
        response.writeHead(200, {
            'Content-Type': 'text/html; charset="utf-8;'
        });
        if (request.url === '/') { // main page
            fs.readFile( path.join(__dirname, './views/index.html'), {
                encoding: 'utf-8'
            },
            (err, data) => {
                if (err) throw err;
                response.end(data);
            });
        } else if (request.url === '/about') {
            fs.readFile( path.join(__dirname, './views/about.html'), {
                encoding: 'utf-8'
            },
            (err, data) => {
                if (err) throw err;
                response.end(data);
            });
        } else if (request.url === '/api/users') {
            response.writeHead(200, {
                'Content-Type' : 'text/json'
            });

            const users = [
                {name : 'Vladilen', age: 25},
                {name : 'Elena', age: 23}
            ];

            response.end( JSON.stringify(users) );
        }
    } 
    else if (request.method === 'POST') {
        const body = [];
        response.writeHead(200, {
            'Content-Type': 'text/html; charset=utf-8'
        });

        request.on('data', data => body.push(data));
        request.on('end', () => {
            const [, message] = body.toString().split('=');
            
            response.end(`
                <h1>Ваше сообщение: ${message}</h1>
            `)
        });
    }
});
server.listen(3000, () => {
    console.log('Server is running...');
});