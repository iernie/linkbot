function filterAndCleanInput(str) {
    var matches = str.match(/[a-zA-Z0-9]+:([a-zA-Z0-9]+:?)+/);
    if (matches) {
        matches = matches[0].split(":");
        matches = matches.filter(function(e) {
            return e;
        });
    }
    return matches;
}

exports.init = function(client, from, to, message) {
    if (message.match(/^!8ball/)) {
        var matches = filterAndCleanInput(message);
        if (matches !== null && matches.length > 1) {
            var random = Math.floor(Math.random() * matches.length);
            client.say(to, from + ", the answer to your question is: " + matches[random]);
        } else {
            client.say(to, "Usage: !8ball first:second:third etc");
        }
    }
};