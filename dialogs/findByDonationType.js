const builder = require("botbuilder");
const api = require("../consumer");

module.exports = function (bot) {
    bot.dialog('/findByDonationType', [
        (session, args, next) => {
            session.sendTyping();
            // Connected to API
            let donationTypes = api.DonationTypes();
            // session.userData.donationType = '';
            builder.Prompts.choice(session, "Filtrar por tipo de donación?", donationTypes, { listStyle: builder.ListStyle.button });
        },
        (session, results, next) => {
            if (results.response) {
                session.sendTyping();
                let selection = results.response.entity;
                // session.userData.donationType = selection;
                // Connected to API
                // console.log({selection});
                let result = api.FilterByDonationType(selection);
                // console.log({result});
                session.replaceDialog('/displayResults', { result });
            }
        }
    ]).triggerAction({
        matches: 'FILTER_BY_DONATION_TYPE' // callback payload
    });
}