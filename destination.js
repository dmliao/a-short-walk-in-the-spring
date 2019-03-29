// code to sort out the destinations, which are ruins, swirls, or cities.
var _ = require('lodash');
var Chance = require('chance');
var chance = new Chance();
var mustache = require('mustache');
var execSync = require('child_process').execSync;

var colors = [
    "red",
    "orange",
    "pink",
    "yellow",
    "purple",
    "blue",
    "violet"
];

var flowerSentences = ["I find them easily, in a quiet hollow.",
    "It takes a bit of searching, but there they are, growing steadily.",
    "They are there, by the side of the road.",
    "I see them. Tiny {{color}} things, clustered here and there.",
    "It took so much searching to find your flowers this time. They looked almost withered, but they were there."
]

var beforePhrases = [
    "After endless travel",
    "Some time later",
    "A little beyond the void",
    "Days of traveling later",
    "After far too long",
    "All too quickly",
    "As the sun rises behind me",
    "As the sun rises before me",
    "As the moonlight peers down at me",
    "On a quiet night"
]

var travelPhrases = [
    "go",
    "fly",
    "walk",
    "drive",
    "sail",
    "ride",
    "run",
    "drift",
    "abscond",
    "wander",
    "turn",
    "embark",
    "soar",
    "climb",
    "cross",
    "escalate",
    "bolt",
    "flee",
    "voyage",
    "disappear",
    "gravitate",
    "stroll",
    "progress",
    "step up",
    "take ship"
];

var chatSentences = [
    "I'm the same as ever.",
    "I hope you are well.",
    "I miss you.",
    "Is it weird for me to be here?",
    "I hope you enjoyed the flowers.",
    "It's good to see you again.",
    "Everything's the same as always.",
    "Nothing's changed much.",
    "I'm okay.",
    "Sometimes I wonder if it's useless, talking to you."
]

function receiveChat(str, message, line, max) {
    // received a message sent from the Python script (a simple "print" statement)
    var s = str;
    s += '"' + message.trim() + '"\n\n';
    // console.log('"' + message.trim() + '"');
    receivedMessage = true;
    var res = _.sample(chatSentences);
    if (line == max - 2) {
        res = "I'll see you again in the spring.";
    }
    s += sendChat("", res, line + 1, max);

    return s;
};

function sendChat(str, message, line, max) {
    var s = str;
    if (line >= max) {
        return str;
    }
    if (line == 0) {
        s += '"' + message.trim() + '" I say.\n\n';
        // console.log('"' + message.trim() + '"');

    }
    else if (line == max - 1) {
        s += 'Your voice fades, far too soon. I make one last promise. "' +
            message.trim() +
            '"\n\n';
    }
    else {
        s += '"' + message.trim() + '"\n\n';
    }
    var response = execSync('python chatbot.py "' + message.trim() + '"', {

    }).toString();
    s += receiveChat("", response, line, max);
    return s;
}

// number is from 0 to 4
function createDestination(dests, number, homePassage) {
    var str = "";
    str += ":: " + "destination-" + number + "\n\n";
    str += mustache.render("{{before}}, I {{go}} to the {{place}} of {{name}}.", {
        before: _.sample(beforePhrases),
        go: _.sample(travelPhrases),
        place: dests[number],
        name: chance.city()
    });

    str += '\n\n';

    str +=
        "You told me you would be there, where the flowers were. So once again, I search.\n\n";

    str += mustache.render(flowerSentences[number % (flowerSentences.length)] +
        "\n\n", {
            color: _.sample(colors)
        });

    str += "[[I wait, trying to hear your voice.|destination-chat-" + number +
        "]]\n\n";

    str += "<<set $dests += 1>>\n\n";

    str += createDestinationChat(dests, number, homePassage);

    var re = /(^|[.!?]\s+)([a-z])/g;
    return str.replace(re, function(m, $1, $2) {
        return $1 + $2.toUpperCase()
    });

    return str;
}

function createDestinationChat(dests, number, homePassage) {
    var str = "";
    str += ":: " + "destination-chat-" + number + "\n\n";
    str += "I hear your voice in the distance, and call out to you.\n\n";

    var greetings = [
        "Hello.",
        "It's been a long time.",
        "I miss you.",
        "Are you there?",
        "It's good to see you."
    ]
    str += sendChat("", _.sample(greetings), 0, _.sample([5, 6, 7]));

    str += "[[I leave the " + dests[number] + " behind.|" + homePassage + "-" +
        number + "]]";

    str += "\n\n";

    var re = /(^|[.!?]\s+)([a-z])/g;
    return str.replace(re, function(m, $1, $2) {
        return $1 + $2.toUpperCase()
    });
}

module.exports = createDestination;

var dests = ["ruins", "city", "hills", "valley", "temple"];
//console.log(createDestination(dests, 0, "home"));