var _ = require('lodash');
var Chance = require('chance');
var chance = new Chance();

var createDestination = require('./destination');
var createTravelRoute = require('./travel-route');
var createHomePassage = require('./home');
var presets = require('./preset');

var createStartPreset = presets.start;
var createEndPreset = presets.end;
var createLostPreset = presets.lost;

var dests = ["ruins", "city", "hills", "valley", "temple"];

function create() {
    var str = "";

    var startingDist = _.sample([2, 3, 4]);
    var gender = chance.gender().toLowerCase();
    var first = chance.first({
        gender: gender
    });

    str += createStartPreset("route-0-" + startingDist + "-0");
    for (var i = 0; i < 5; i++) {
        // add route passages
        str += createTravelRoute("route-" + i, startingDist, i, dests[i],
            "destination-" + i,
            "lost-" + i);

        // add destination passages
        str += createDestination(dests, i, "home");

        // add lost passages
        str += createLostPreset(dests[i], i);

        startingDist = _.sample([2, 3, 4]);

        // add home passages
        str += createHomePassage(gender, first, i, 5, "route-" + (i + 1),
            startingDist);

    }
    str += createEndPreset(5);

    return str;

}

console.log(create());