'use strict';
const Alexa = require('alexa-sdk');

var http = require('http');

const API_URL = "BUS API URL";


function secondsToString(seconds)
{
    var numminutes = Math.floor(seconds  / 60);
    var numseconds = (((seconds % 31536000) % 86400) % 3600) % 60;
    return numminutes + " minutes " + numseconds + " seconds";
}


// 요청을 처리하는 Handlers Object
const handlers = {
    // "Open Rocket Bus" 라고 말하면 실행되는 function
    "LaunchRequest": function () {
        var alexa = this;

        http.get(API_URL, function(res) {
            res = res.setEncoding('utf8');
            var body = '';
            res.on('data', function(chunk) {
                body += chunk;
            });
            res.on('end', function() {
                // console.log(body);
                var hurry = false;
                if(Number(JSON.parse(body).exps1[0]) < 60){
                    hurry = true;
                }
                var firstBusTime = secondsToString(JSON.parse(body).exps1[0]);
                var secondBusTime = secondsToString(JSON.parse(body).exps2[0]);

                if(hurry) {
                    alexa.response.speak(`Hello Rocket, 
                                      Your first bus comes in ${firstBusTime}.
                                      You'd better hurry.
                                      And second bus comes in ${secondBusTime}.
                                      `);
                } else {
                    alexa.response.speak(`Hello Rocket, 
                                      Your first bus comes in ${firstBusTime}.
                                      And second bus comes in ${secondBusTime}.
                                      `);
                }
                alexa.emit(':responseReady');
            });
        }).on('error', function(e) {
            console.log("Got error: " + e.message);
            // context.done(null, 'FAILURE');
        });
    },
    // "Tell Rocket Bus {Intent Words}" 라고 말하면 실행되는 function
    "RocketBusIntent": function () {
        this.response.speak("Hello, Junghyun");
        this.emit(':responseReady');
    }
};

exports.handler = function(event, context, callback){
    var alexa = Alexa.handler(event, context);
    alexa.registerHandlers(handlers);
    alexa.execute();
};