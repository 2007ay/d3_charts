const express = require("express");
const bodyParser = require('body-parser');
const port = 8081;
const server = express();

const {
    loadData
} = require('./dataHandler.js');


server.use(bodyParser.json());
server.use(bodyParser.urlencoded({
    extended: true
}));

server.use(express.static(__dirname + '/public'));

function allowCrosAccess(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
}

server.get('/data/:personId/:type', (req, res, next) => {
    try {
        const body = {
            parentId,
            type
        } = req.params;
        res.json(loadData(body));
    } catch (ex) {
        next(ex);
    }
})

server.use(allowCrosAccess);
server.listen(port, () => {
    console.log(`Application started at port ${port}`);
});