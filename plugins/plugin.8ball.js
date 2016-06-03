function filterAndCleanInput(str) {
    var matches = str.match(/^(\S+)\s(.*)/);
    if (matches !== null) {
        var q = matches.splice(1);
        if(q !== null && q.length > 0 && q[1] !== null && q[1].trim() !== '') {
            return q[1].split(":").filter(function(val) { return val !== ''; });
        }
    }
    return null;
}

exports.init = function(client, from, to, message) {
    if (message.match(/^!8ball/)) {
        var matches = filterAndCleanInput(message);
        if (matches !== null && matches.length > 1) {
            var random = Math.floor(Math.random() * matches.length);
            client.say(to, from + ", svaret på spørsmålet ditt er: " + matches[random]);
        }
    }
};
