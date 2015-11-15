var colors = require('colors');
var inquirer = require("inquirer");
var prettyjson = require('prettyjson');
var request = require('request');
var async = require('async');

var baseurl = 'https://api.tripadvisor.com/api/partner/2.0/';
var takey = process.env.TRIPADVISOR_KEY;
var coordinates = '40.7903,-73.9597';

exports.mainloop = function() {
    inquirer.prompt([
        {
            type: 'list', name: 'l1', message: 'What would you like to browse?',
            choices: ['Flights', 'Hotels', 'Restaurants', 'Attractions', 'Exit (ctrl-D)']
        }
    ], function(answers) {
        //console.log(answers);
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
        else if(answers.l1 == 'Attractions') {
            attractions();
        }
    });
}

var flights = function() {
}

var hotels = function() {
    var start = new Date();
    request(baseurl + 'map/' + coordinates + '/hotels?key=' + takey + '&distance=0.5', function(err, response, body) {
        response.responseTime = new Date() - start;
        console.log(response.responseTime);
        var data = JSON.parse(body).data;
        var choice = [];
        for(var i in data) {
            choice.push({name: data[i].name, value: i});
        }
        async.forever(function(next) {
            inquirer.prompt([
                {
                    type: 'list', name: 'l1', message: 'Which Hotel?',
                    choices: choice
                }
            ], function(answers) {
                //console.log(data[answers.l1].api_detail_url);
                request(data[answers.l1].api_detail_url, function(err, response, body) {
                    var d = JSON.parse(body);
                    console.log(prettyjson.render(d));
                    for(var i in d.subratings) {
                        process.stdout.write(d.subratings[i].localized_name + ': ' + colorize(d.subratings[i].value) + ' ');
                    }
                    console.log();
                    var choice = [];
                    for(var i in d.reviews) {
                        choice.push({name: d.reviews[i].title, value: i});
                    }
                    if(choice.length == 0) { next();return; };
                    async.forever(function(next2) {
                        inquirer.prompt([
                            {
                                type: 'list', name: 'l2', message: 'Which review?',
                                choices: choice
                            }
                        ], function(answers) {
                            console.log("Rating: " + colorize(String(d.reviews[answers.l2].rating)));
                            console.log(d.reviews[answers.l2].text);
                            inquirer.prompt([
                                {
                                    type: 'confirm', name: 'l3', message: 'More?'
                                }
                            ], function(answers) {
                                console.log(answers.l3 == true);
                                if(answers.l3)
                                    next2(null);
                                else
                                    next2("no mas pls");
                            });
                        });
                    },
                    function(err) {
                        console.log(err);
                        if(err) next();
                    });
                });
            });
        },
        function(err) {
        });
    });
}

var colorize = function(s) {
    if(s[0] == 4 || s[0] == 5)
        return colors.green(s);
    else if(s[0] == 2 || s[0] == 3)
        return colors.yellow(s);
    else if(s[0] == 1)
        return colors.red(s);
    else return s;
}

var restaurants = function() {
    var start = new Date();
    request(baseurl + 'map/' + coordinates + '/restaurants?key=' + takey + '&distance=0.5', function(err, response, body) {
        response.responseTime = new Date() - start;
        console.log(response.responseTime);
        var data = JSON.parse(body).data;
        var choice = [];
        for(var i in data) {
            choice.push({name: data[i].name, value: i});
        }
        async.forever(function(next) {
            inquirer.prompt([
                {
                    type: 'list', name: 'l1', message: 'Which Restaurant?',
                    choices: choice
                }
            ], function(answers) {
                //console.log(data[answers.l1].api_detail_url);
                request(data[answers.l1].api_detail_url, function(err, response, body) {
                    var d = JSON.parse(body);
                    console.log(prettyjson.render(d));
                    for(var i in d.subratings) {
                        process.stdout.write(d.subratings[i].localized_name + ': ' + colorize(d.subratings[i].value) + ' ');
                    }
                    console.log();
                    var choice = [];
                    for(var i in d.reviews) {
                        choice.push({name: d.reviews[i].title, value: i});
                    }
                    if(choice.length == 0) { next();return; };
                    async.forever(function(next2) {
                        inquirer.prompt([
                            {
                                type: 'list', name: 'l2', message: 'Which review?',
                                choices: choice
                            }
                        ], function(answers) {
                            console.log("Rating: " + colorize(String(d.reviews[answers.l2].rating)));
                            console.log(d.reviews[answers.l2].text);
                            inquirer.prompt([
                                {
                                    type: 'confirm', name: 'l3', message: 'More?'
                                }
                            ], function(answers) {
                                console.log(answers.l3 == true);
                                if(answers.l3)
                                    next2(null);
                                else
                                    next2("no mas pls");
                            });
                        });
                    },
                    function(err) {
                        console.log(err);
                        if(err) next();
                    });
                });
            });
        },
        function(err) {
        });
    });
}

var attractions = function() {
    var start = new Date();
    request(baseurl + 'map/' + coordinates + '/attractions?key=' + takey + '&distance=0.5', function(err, response, body) {
        response.responseTime = new Date() - start;
        console.log(response.responseTime);
        var data = JSON.parse(body).data;
        var choice = [];
        for(var i in data) {
            choice.push({name: data[i].name, value: i});
        }
        async.forever(function(next) {
            inquirer.prompt([
                {
                    type: 'list', name: 'l1', message: 'Which Attraction?',
                    choices: choice
                }
            ], function(answers) {
                //console.log(data[answers.l1].api_detail_url);
                request(data[answers.l1].api_detail_url, function(err, response, body) {
                    var d = JSON.parse(body);
                    console.log(prettyjson.render(d));
                    for(var i in d.subratings) {
                        process.stdout.write(d.subratings[i].localized_name + ': ' + colorize(d.subratings[i].value) + ' ');
                    }
                    console.log();
                    var choice = [];
                    for(var i in d.reviews) {
                        choice.push({name: d.reviews[i].title, value: i});
                    }
                    if(choice.length == 0) { next();return; };
                    async.forever(function(next2) {
                        inquirer.prompt([
                            {
                                type: 'list', name: 'l2', message: 'Which review?',
                                choices: choice
                            }
                        ], function(answers) {
                            console.log("Rating: " + colorize(String(d.reviews[answers.l2].rating)));
                            console.log(d.reviews[answers.l2].text);
                            inquirer.prompt([
                                {
                                    type: 'confirm', name: 'l3', message: 'More?'
                                }
                            ], function(answers) {
                                console.log(answers.l3 == true);
                                if(answers.l3)
                                    next2(null);
                                else
                                    next2("no mas pls");
                            });
                        });
                    },
                    function(err) {
                        console.log(err);
                        if(err) next();
                    });
                });
            });
        },
        function(err) {
        });
    });
}
