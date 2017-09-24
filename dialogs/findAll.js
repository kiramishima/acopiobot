const api = require("../consumer");

module.exports = function (bot) {
    bot.dialog('/findAll', [
        (session, args, next) => {
            session.sendTyping();
            // Connected to API
            api.GetAll().then(result => {
                session.replaceDialog('/displayResults', { result });
            });
        }
    ]).triggerAction({
        matches: 'GENERAL_LIST' // callback payload
    });
}