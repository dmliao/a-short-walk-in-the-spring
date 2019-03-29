var _ = require('lodash');
var mustache = require('mustache');
var Sentencer = require('sentencer');

var choose = require('./utils/choose');

// we start a random distance from the goal
var distance = _.sample([2, 3, 4]);

var prevTerrain;
var prevPrecip;
var prevHumidity;

// and persistent features
var terrainTypes = {
    'grass': {
        syn: ['grass', 'grassland', 'moss', 'mossy rock'],
        barriers: ['trees', 'upturned stones', 'brambles', 'hedges',
            'endless voids'
        ],
        adjs: ['soft', 'green', 'thin', 'swaying', 'dark', 'whispering',
            'pale', 'wet', 'dry'
        ],
        objects: ['bench', 'statue', 'pillar', 'slab']
    },
    'leaves': {
        syn: ['leaves'],
        barriers: ['trees', 'mounds', 'bushes', 'cliffs'],
        adjs: ['scattered', 'dry', 'dead', 'red', 'colorful', 'dark',
            'light', 'curled', 'wet'
        ],
        objects: ['statue', 'carving', 'branch', 'pine cone']
    },
    'rock': {
        syn: ['rock', 'stone', 'pebbles'],
        barriers: ['cliffs', 'trees', 'stones', 'brambles', 'spikes'],
        adjs: ['loose', 'crumbled', 'wet', 'solid'],
        objects: ['flower', 'pillar', 'slab', 'tower', 'clock']
    },
    'water': {
        syn: ['water', 'shallow streams'],
        barriers: ['waterfall', 'rocks', 'stones', 'brambles'],
        adjs: ['calm', 'clear', 'murky'],
        objects: ['pillar', 'stone', 'statue', 'ruin']
    }
    /*'leaves',
    'moss',
    'rock',
    'sand',
    'concrete'*/
};

var terrainSentences = [
    "I tire for a moment, and rest upon the {{terrain}} beneath me.",
    "The {{adj}} {{terrain}} guide me.",
    "{{adj}} {{terrain}} envelopes me."
]

var pathTypes = [
    'path',
    'way forward',
    'road',
    'route on the map',
    'course I must take'
]

var pathMoves = [
    'is straight and narrow',
    'winds about',
    'seems to disappear',
    'branches off into infinite directions',
    'veers to the north',
    'veers to the south',
    'veers east',
    'veers west',
    'streches out before me',
    'twists about'
]
var pathSentences = [
    "The {{path}} {{moves}}.",
    "The {{path}} {{moves}}, beckoning me onwards.",
    "The {{path}} {{moves}}, as I find myself surrounded by {{terrain}}."
]

var weatherTypes = [
    "brilliantly clear",
    "clear",
    "sunny",
    "bright",
    "overcast",
    "cloudy",
    "grey",
    "misty",
    "restless",
    "rainy",
    "snowy"
]

var startingSentences = [
    "I begin a long quest.",
    "My body begins to move, as if awaiting an arrival.",
    "I leave for a place I have never seen.",
    "There is still something I have to do.",
    "This is the last promise I have made."
]

var weatherSentences = [
    "It's {{weather}}.",
    "It's {{weather}} now.",
    "The skies have become {{weather}}."
]

var wallsOf = [
    "a wall of",
    "a stretch of",
    "a span of",
    "{{an_adjective}} mass of",
    "a group of",
    "{{an_adjective}} blow of",
    "a field of",
    "{{an_adjective}} swarm of",
    "a gash of"
]

var locationPhrases = [
    "north",
    "south",
    "east",
    "west",
    "north-east",
    "north-west",
    "south-east",
    "south-west",
    "east-west",
    "north-south",
    "in all directions"
]

var barrierSentences = [
    "{{wallsof}} {{adjective}} {{barrier}} {{verbs}} {{location}} of where I stand.",
    "I'm surrounded by {{wallsof}} {{adjective}} {{barrier}}.",
    "There is {{wallsof}} {{adjective}} {{barrier}} off in the distance.",
    "There is {{wallsof}} {{adjective}} {{barrier}} nearby.",
    "I see {{wallsof}} {{adjective}} {{barrier}} beckoning towards me."
]

var objNoBarrierSentences = [
    "{{anadjective}} {{object}} {{verbs}} here.",
    "I find {{anadjective}} {{object}} almost buried in the {{terrain}}.",
    "The air is filled with longing, and the {{terrain}} a certain sorrow."
]

var objLocationPhrases = [
    "beneath it",
    "before it",
    "beyond it",
    "beside it",
    "crowning over it",
    "aside it",
    "nearby",
]
var objVerbs = [
    "lies",
    "sits",
    "rests",
    "exists",
    "sleeps",
    "awaits",
]

var objDescriptors = [
    "laughing at the gloom",
    "crystallized in the silence",
    "silent",
    "staring menacingly at the middle distance"
]

var objBarrierSentences = [
    "{{anadjective}} {{object}} {{verbs}}, peering.",
    "{{location}}, {{verbs}} {{anadjective}} {{object}}, {{descriptor}}."
]

var noObjSentences = [
    "It's quiet.",
    "It smells faintly of flowers.",
    "I am reminded of the tranquility of the ocean.",
    "It's lonely out here.",
    "I wonder how everyone else is doing while I'm gone.",
    "I wait."
]

var surrealSentences = [
    "A meticulous thought overtakes me.",
    "Small lights flit here and there, dancing at the corner of my vision.",
    "A sense of unease washes over me, quickly replaced by a feeling of longing.",
    "I am struck with the feeling that I have been here before.",
    "It seems that I shall keep you waiting for just a moment longer, I'm afraid."
]

var surrealSentences2 = [
    "Everything fades.",
    "I search for something that cannot be found.",
    "Slow mists creep up onto a far shore, curling and twisting in the quiet.",
    "I hear the echoes of those who I can no longer meet.",
    "Once, I had a promise to fulfill. I wander endlessly, astounded by all I could see.",
    "I wonder, if I should forge a path that I said I would, or if I should keep exploring to see what it is I find.",
    "I see the world's edges, and the parts where it is just a little bit broken.",
    "A fog peers in through the cracks of my eyelids."
]

var surrealMadlibs = [
    "{{ an_adjective }} {{ noun }} sings.",
    "{{ an_adjective }} {{ noun }} falls deep into my dreams.",
    "{{ an_adjective }} {{ noun }} echoes.",
    "{{ an_adjective }} {{ noun }} reflects.",
    "Countless {{nouns}} swarm.",
    "{{nouns}}."
];

var currentWeather = null;
var currentTerrain = null;

// and create a route
function createRoute(title, startingDist, count, destination,
    destinationPassage,
    failedPassage) {

    var time = 0;
    var maxTime = 10;
    var dist = startingDist;

    var weather = choose(0, weatherTypes.length);
    var terrain = _.sample(terrainTypes);

    var paths = []; // the branches we have to go down
    var done = {}; // which paths have we already done? don't be redundant

    // FIRST PASSAGE
    var str = "";
    str += createHeader(title + "-" + startingDist + "-" + time);

    // start the journey
    str += "It's that time again.\n\n" + startingSentences[count];

    str += '\n\n';

    // start the passage
    str += createPassage(time, startingDist, weatherTypes[weather],
        terrain, 0.3, 0.5, destination);

    // CREATE THE CHOICES
    str += '[[Press onwards|' + title + '-' + (dist - 1) + "-" + (time + 1) +
        ']]\n\n';
    str += '[[Wander|' + title + '-' + (dist + 1) + "-" + (time + 1) +
        ']]\n\n';

    paths.push(dist - 1);
    paths.push(dist + 1);

    done[0] = [];

    // LOOP PASSAGE
    while (time < maxTime) {
        time += 1;

        var p = paths.length;
        for (var i = 0; i < p; i++) {
            dist = paths.shift();

            if (!done[time]) {
                done[time] = [];
            }

            if (dist == 0) {
                continue;
            }
            if (done[time] && done[time][dist]) {
                continue;
            }

            str += createHeader(title + "-" + dist + "-" + time);
            str += createPassage(time, dist, weatherTypes[weather], terrain,
                0.3, 0.5, destination);

            done[time][dist] = true;

            if (time >= maxTime - 1) {
                // CREATE THE RUN OUT OF TIME CHOICE
                if (dist == 1) {
                    if (destinationPassage) {
                        str += '[[Arrive.|' + destinationPassage + ']]\n\n';
                    }
                }
                else {
                    if (failedPassage) {
                        str += "[[I'm out of time.|" + failedPassage + ']]\n\n';
                    }
                }
            }
            else if (dist == 1) {
                // CREATE THE 'GO TO DESTINATION' CHOICES
                if (destinationPassage) {
                    str += '[[Arrive.|' + destinationPassage + ']]\n\n';
                }
                str += '[[Wander|' + title + '-' + (dist + 1) + "-" + (time + 1) +
                    ']]\n\n';
                paths.push(dist + 1);
            }
            else {
                // CREATE THE CHOICES
                str += '[[Press onwards.|' + title + '-' + (dist - 1) + "-" + (
                    time + 1) + ']]\n\n';
                str += '[[Wander.|' + title + '-' + (dist + 1) + "-" + (time +
                        1) +
                    ']]\n\n';

                paths.push(dist - 1);
                paths.push(dist + 1);
            }
        }
    }

    var re = /(^|[.!?]\s+)([a-z])/g;
    return str.replace(re, function(m, $1, $2) {
        return $1 + $2.toUpperCase()
    });

}

function createHeader(title) {
    var str = ":: " + title + "\n\n";
    return str;
}

function createPassage(time, dist, weather, terrain, barrierChance,
    objectChance, destination) {
    var str = "";

    var f = 0;
    // if the weather has changed, add a weather sentence.
    if (weather != currentWeather) {
        currentWeather = weather;
        str += mustache.render(_.sample(weatherSentences), {
            weather: currentWeather
        }) + ' ';
        f = 1;
    }

    if (terrain != currentTerrain) {
        currentTerrain = terrain;
        str += mustache.render(_.sample(terrainSentences), {
            terrain: _.sample(terrain.syn),
            adj: _.sample(terrain.adjs)
        });
        f = 1;
    }

    if (f == 1) {
        str += "\n\n";
    }

    var barrier = null;
    var object = null;

    if (Math.random() > barrierChance) {
        barrier = _.sample(terrain.barriers);
    }
    if (Math.random() > objectChance) {
        object = _.sample(terrain.objects);
    }

    if (dist >= 2) {
        if (barrier) {
            str += mustache.render(_.sample(barrierSentences), {
                wallsof: Sentencer.make(_.sample(wallsOf)),
                adjective: Sentencer.make("{{adjective}}"),
                barrier: barrier,
                location: _.sample(locationPhrases),
                verbs: _.sample(objVerbs)
            });
        }

        // describe any objects
        if (barrier && object) {
            str += " ";
            str += mustache.render(_.sample(objBarrierSentences), {
                anadjective: Sentencer.make("{{an_adjective}}"),
                object: object,
                verbs: _.sample(objVerbs),
                location: _.sample(objLocationPhrases),
                descriptor: _.sample(objDescriptors)
            });
        }
        else if (object) {
            str += " ";
            str += mustache.render(_.sample(objNoBarrierSentences), {
                object: object,
                verbs: _.sample(objVerbs),
                terrain: _.sample(terrain.syn),
                anadjective: Sentencer.make("{{an_adjective}}")
            });
        }
        else {
            str += " ";
            str += _.sample(noObjSentences);
        }

        str += '\n\n';
    }

    if (dist >= 1) {
        // add a sentence for the path
        str += mustache.render(_.sample(pathSentences), {
            path: _.sample(pathTypes),
            moves: _.sample(pathMoves),
            terrain: _.sample(terrain.syn)
        });

        str += '\n\n';
    }

    if (dist >= 4) {
        str += _.sample(surrealSentences);

        if (Math.random() > 0.4 || dist == 4) {
            str += '\n\n';
        }
        else {
            str += ' ';
        }
    }
    if (dist >= 5) {
        str += _.sample(surrealSentences2);
        if (Math.random() > 0.4 || dist == 5) {
            str += '\n\n';
        }
        else {
            str += ' ';
        }
    }
    if (dist >= 6) {
        var tot = choose(1, 5);
        for (var i = 0; i < tot; i++) {
            str += Sentencer.make(_.sample(surrealMadlibs));
            if (Math.random() > 0.4 || i == tot - 1) {
                str += '\n\n';
            }
            else {
                str += ' ';
            }
        }
    }

    // add sentence for distance.
    if (time > 0) {
        if (dist == 1) {
            var distanceQuotes = [
                "I feel as though I am getting close.",
                "There isn't that much further to go.",
                "I'll reach the {{settlement}} soon."
            ];

            str += mustache.render(_.sample(distanceQuotes), {
                settlement: destination
            });
        }
        else if (dist <= 3) {
            var distanceQuotes = [
                "I can keep up this pace for some time.",
                "It feels nostalgic, somehow."
            ];

            str += mustache.render(_.sample(distanceQuotes), {
                settlement: destination
            });
        }
        else if (dist <= 5) {
            var distanceQuotes = [
                "I feel as though the {{settlement}} is incredibly far away.",
                "Everything takes time."
            ];

            str += mustache.render(_.sample(distanceQuotes), {
                settlement: destination
            });
        }
        else {
            var distanceQuotes = [
                "I'm lost.",
                "I can't help but think I'm getting off track.",
                "Forgive me.",
                "I fear that I've lost track of the time.",
                "I listen to the sounds around me.",
                "I shouldn't be here, but I don't quite want to leave just yet."
            ]

            str += mustache.render(_.sample(distanceQuotes), {
                settlement: destination
            });
        }
        str += '\n\n';
    }

    // return the passage
    var re = /(^|[.!?]\s+)([a-z])/g;
    return str.replace(re, function(m, $1, $2) {
        return $1 + $2.toUpperCase()
    });

}

module.exports = createRoute;

// createRoute("first-route", distance, 0);
// console.log(createRoute("first-route", distance, 0));