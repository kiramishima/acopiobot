const builder = require("botbuilder");
const api = require("../consumer");

module.exports = function (bot) {
    bot.dialog('/findByLocation', [
        (session) => {
            session.sendTyping();
            // Connected to API
            api.Locations().then(resp => {
                builder.Prompts.choice(session, "Filtrar por locación?", resp, { listStyle: builder.ListStyle.button });
            });
        },
        (session, results) => {
            if (results.response) {
                session.sendTyping();
                let selection = results.response.entity;
                // Connected to API
                api.FilterByLocation(selection).then(result => {
                    session.replaceDialog('/displayResults', { result });
                });
            }
        }
    ]).triggerAction({
        matches: 'FILTER_BY_LOCATION' // callback payload
    });
}