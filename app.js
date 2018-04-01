var express = require('express');
var app = express();


app.use(express.static('public'));

var fs = require('fs');
var busRawKey = fs.readFileSync('./credentials/bus_service_key.json');
var busServiceKey = JSON.parse(busRawKey)["serviceKey"];
var busId = JSON.parse(busRawKey)["busRouteId"];

var subwayRawKey = fs.readFileSync('./credentials/subway_service_key.json');
// var subwayServiceKey = JSON.parse(subwayRawKey)["serviceKey"];
var subwayServiceKey = "sample";
var subwayId = JSON.parse(subwayRawKey)["subwayStationId"];

var SlackRawKey = fs.readFileSync('./credentials/service_key.json');
var slackToken = JSON.parse(SlackRawKey)["slackToken"];


const BUS_API_URL = "http://ws.bus.go.kr/api/rest/arrive/getArrInfoByRouteAll?serviceKey=" + busServiceKey;
const SUBWAY_API_URL = "http://swopenapi.seoul.go.kr/api/subway/" + subwayServiceKey + "/xml/realtimeStationArrival/1/5/" + subwayId;

var request = require('request');
var parseString = require('xml2js').parseString;
var queryParams = {busRouteId: busId};

app.get('/api/bus', function(req, res){
    request({url:BUS_API_URL, qs:queryParams}, function(err, response, body){
        if(err) { console.log(err); return; }

        parseString(body, function (err, result) {
            if(err) { console.log(err); return; }
            res.json(result.ServiceResult.msgBody[0].itemList[19]);
        });
    });
});

app.get('/api/subway/:direction', function(req, res){
    var dir = req.params.direction;
    request(SUBWAY_API_URL, function(err, response, body){
        if(err) { console.log(err); return; }

        parseString(body, function (err, result) {
            if(err) { console.log(err); return; }

            if(dir === "down") {
                results = [result.realtimeStationArrival.row[0].barvlDt[0], result.realtimeStationArrival.row[2].barvlDt[0]]
            } else {
                results = [result.realtimeStationArrival.row[1].barvlDt[0], result.realtimeStationArrival.row[3].barvlDt[0]]
            }
            res.json(results);
        });
    });
});

var Bot = require('slackbots');

// create a bot
var settings = { token: slackToken, name: 'noti' };
var bot = new Bot(settings);

app.get('/findMyPhone', function (req, res){
    bot.postMessageToChannel('general', 'Where is My Phone!');
    res.json({msg:"done"});
})

module.exports = app;
