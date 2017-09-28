const builder = require("botbuilder");
const api = require("../consumer");

module.exports = function (bot) {
    bot.dialog('/findByDonationType', [
        (session) => {
            session.sendTyping();
            // Connected to API
            api.DonationTypes().then(resp => {
                builder.Prompts.choice(session, "Filtrar por tipo de donación?", resp, { listStyle: builder.ListStyle.button });
            });
        },
        (session, results) => {
            if (results.response) {
                session.sendTyping();
                let selection = results.response.entity;
                // Connected to API
                api.FilterByDonationType(selection).then(result => {
                    session.replaceDialog('/displayResults', { result });
                });
            }
        }
    ]).triggerAction({
        matches: 'FILTER_BY_DONATION_TYPE' // callback payload
    });
}