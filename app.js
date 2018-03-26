var express = require('express');
var app = express();

var fs = require('fs');
var rawKey = fs.readFileSync('./credentials/bus_service_key.json');
var serviceKey = JSON.parse(rawKey)["serviceKey"];
var busId = JSON.parse(rawKey)["busRouteId"];


const API_URL = "http://ws.bus.go.kr/api/rest/arrive/getArrInfoByRouteAll?serviceKey=" + serviceKey;
var request = require('request');
var parseString = require('xml2js').parseString;
var queryParams = {busRouteId: busId};

app.get('/api/bus', function(req, res){
    request({url:API_URL, qs:queryParams}, function(err, response, body){
        if(err) { console.log(err); return; }

        parseString(body, function (err, result) {
            if(err) { console.log(err); return; }
            console.log(result.ServiceResult.msgBody[0].itemList[19]);
            res.json(result.ServiceResult.msgBody[0].itemList[19]);
        });
    });
});

module.exports = app;
