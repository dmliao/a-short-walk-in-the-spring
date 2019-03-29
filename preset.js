var fs = require('fs');
var mustache = require('mustache');

function createStartPassage(routeName) {
    var str = ":: Start\n\n";

    var file = fs.readFileSync('./preset/start.txt');

    str += mustache.render(file.toString(), {
        dest: routeName
    });

    return str;
}

function createEndPassage(number) {
    var str = ":: end\n\n";

    var file = fs.readFileSync('./preset/end.txt');

    str += mustache.render(file.toString(), {
        number: number
    });

    return str;
}

function createLostPassage(destination, number) {
    var str = ":: lost-" + number + "\n\n";

    var file = fs.readFileSync('./preset/lost.txt');

    str += mustache.render(file.toString(), {
        home: "home-" + number,
        destination: destination
    });

    return str;
}

module.exports = {
    start: createStartPassage,
    end: createEndPassage,
    lost: createLostPassage
};