const express = require("express");
const path = require("path");

var app = express();

app.use(express.static(path.join(__dirname, 'javascript')));
app.use(express.static(path.join(__dirname, 'styles')));
app.use(express.static(path.join(__dirname, 'imgs')));

app.get("/", function (request, response) {
    response.sendFile(path.join(__dirname + "/views/index.html"))
});

app.get('/directions', function (request, response) {
    response.sendFile(path.join(__dirname + '/views/directions.html'));
});
app.get('/map', function (request, response) {
    response.sendFile(path.join(__dirname + '/imgs/mapa.png'));
});
app.listen(3000);