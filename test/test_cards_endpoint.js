const api = require("../consumer");

var data = api.ObtenerTodos();
console.log({data});
console.log(data.length);