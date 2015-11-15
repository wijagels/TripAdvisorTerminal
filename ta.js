var colors = require('colors');
var inquirer = require("inquirer");
var prettyjson = require('prettyjson');
var request = require('request');

var baseurl = 'https://api.tripadvisor.com/api/partner/2.0/';
var takey = process.env.TRIPADVISOR_KEY;
var coordinates = '40.7903,-73.9597';

exports.mainloop = function() {
    inquirer.prompt([
        {
            type: 'list', name: 'l1', message: 'What would you like to browse?',
            choices: ['Flights', 'Hotels', 'Restaurants', 'Exit (ctrl-D)']
        }
    ], function(answers) {
        console.log(answers);
        if(answers.l1 == 'Exit (ctrl-D)') {
            process.exit(0);
        }
        else if(answers.l1 == 'Flights') {
            flights();
        }
        else if(answers.l1 == 'Hotels') {
            hotels();
        }
        else if(answers.l1 == 'Restaurants') {
            restaurants();
        }
    });
}

var flights = function() {
}

var hotels = function() {
    request(baseurl + 'map/' + coordinates + '/hotels?key=' + takey + '&distance=0.5', function(err, response, body) {
        var data = JSON.parse(body).data;
        var choice = [];
        for(var i in data) {
            choice.push({name: data[i].name, value: i});
        }
        inquirer.prompt([
            {
                type: 'list', name: 'l1', message: 'Which Hotel?',
                choices: choice
            }
        ], function(answers) {
            console.log(data[answers.l1].api_detail_url);
            request(data[answers.l1].api_detail_url, function(err, response, body) {
                var d = JSON.parse(body);
                //console.log(prettyjson.render(d));
                for(var i in d.subratings) {
                    process.stdout.write(d.subratings[i].localized_name + ': ' + d.subratings[i].value + ' ');
                }
                console.log();
            });
        });
    });
}

var restaurants = function() {
}
