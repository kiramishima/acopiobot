// Script que consume los datos del JSON de http://comoayudar.mx
const request = require('request');

function getAll () {
    return new Promise((resolve, reject) => {
        request.get({
            url: `http://comoayudar.mx/cards.js`
        }, (err, res) => {
            resolve(res.body)
        })
    });
}
module.exports = {
    ObtenerTodos: getAll
}