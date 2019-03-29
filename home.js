// create all the 'home' passages
// which are visited after lost and destination passages

var mustache = require('mustache');

var visitorSentences = [
    "{{they}} visits frequently, and always asks about my health. But I'm fine. I'm healthy enough to find you, aren't I?",
    "{{they}} says {{they}} wishes {{they}} could come with me. But you know how it is. It's hard to travel these days.",
    "{{they}} is visiting less often now.",
    "I've lost track of the last time {{they}} was here. {{they}} has {{their}} own life now.",
    "I've been on my own for a while now. It's fine. I'm not the kind of person who can do something and stop halfway. I will set off again tomorrow, like I have all the other times."
];

var pronouns = {
    female: {
        they: "she",
        them: "her",
        their: "her",
        theirs: "hers"
    },
    male: {
        they: "he",
        them: "him",
        their: "his",
        theirs: "his"
    }
}

function createHomePassage(gender, name, number, maxNumber, route, startingDist) {
    // have a link to the route of the next number

    var str = ":: home-" + number + "\n\n";

    if (number >= maxNumber - 1) {
        str +=
            "That's all you gave me. There are no more places to go.\n\nNo one has visited in a long time, but that's okay.\n\n";
        str +=
            "It's spring. [[I go outside once more to see the flowers.|end]]\n\n";
        return str;
    }

    str +=
        "I see you. Is it that time again?\n\nIt's been a while, but it feels like nothing's changed.\n\n"

    str += mustache.render("{{name}} visited. ", {
        name: name
    });
    if (number == 0) {
        str += "Your old friend misses you too, you know. ";
    }
    str += "\n\n";
    var n = Math.floor(visitorSentences.length * (number / maxNumber));
    str += mustache.render(visitorSentences[n], {
        they: pronouns[gender].they,
        them: pronouns[gender].them,
        their: pronouns[gender].their,
        theirs: pronouns[gender].theirs
    });

    str += '\n\n';

    str += mustache.render("[[It's time.|{{dest}}]]", {
        dest: route + '-' + startingDist + '-0'
    });

    str += '\n\n';

    var re = /(^|[.!?]\s+)([a-z])/g;
    return str.replace(re, function(m, $1, $2) {
        return $1 + $2.toUpperCase()
    });
}

module.exports = createHomePassage;
// console.log(createHomePassage('female', 'Jen', 4, 5, 'route', 3));