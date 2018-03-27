'use strict';
const Alexa = require('alexa-sdk');

var http = require('http');

const API_URL = "http://rocketbus.ap-northeast-2.elasticbeanstalk.com/api/subway/";


function secondsToString(seconds)
{
    var numminutes = Math.floor(seconds  / 60);
    var numseconds = (((seconds % 31536000) % 86400) % 3600) % 60;
    return numminutes + " minutes " + numseconds + " seconds";
}


const handlers = {
    "LaunchRequest": function(){
        this.response.speak("Hello, Rocket. Which direction are you headed?").listen("which direction?");
        this.emit(':responseReady');
    },
    "RocketSubwayIntent": function () {
        var alexa = this;
        var dir = alexa.event.request.intent.slots.direction.value

        http.get(API_URL + dir, function(res) {
            res = res.setEncoding('utf8');
            var body = '';
            res.on('data', function(chunk) {
                body += chunk;
            });
            res.on('end', function() {

                var firstSubwayTime = secondsToString(JSON.parse(body)[0]);
                var secondSubwayTime = secondsToString(JSON.parse(body)[1]);

                alexa.response.speak(`This is information for ${dir} direction.
                                    Your first subway comes in ${firstSubwayTime}.
                                    And second subway comes in ${secondSubwayTime}.
                                    `);
                alexa.emit(':responseReady');
            });
        }).on('error', function(e) {
            console.log("Got error: " + e.message);
            // context.done(null, 'FAILURE');
        });
    }
};

exports.handler = function(event, context, callback){
    var alexa = Alexa.handler(event, context);
    alexa.registerHandlers(handlers);

    alexa.execute();
};