const builder = require("botbuilder");
const api = require("../consumer");

module.exports = function (bot) {
    bot.dialog('/findByLocation', [
        (session, args, next) => {
            session.sendTyping();
            // Connected to API
            let donationTypes = api.Locations();
            // session.userData.location = '';
            builder.Prompts.choice(session, "Filtrar por locación?", donationTypes, { listStyle: builder.ListStyle.button });
        },
        (session, results, next) => {
            if (results.response) {
                session.sendTyping();
                let selection = results.response.entity;
                // session.userData.location = selection;
                // Connected to API
                // console.log({selection});
                let result = api.FilterByLocation(selection);
                // console.log({result});
                session.replaceDialog('/displayResults', { result });
            }
        }
    ]).triggerAction({
        matches: 'FILTER_BY_LOCATION' // callback payload
    });
}