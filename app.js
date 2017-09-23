const restify = require("restify");
const builder = require("botbuilder");
const api = require("./consumer");
const facebook = require('botbuilder-facebookextension');

// Create chat connector for communicating with the Bot Framework Service
const connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
// Create Bot Instance
const bot = new builder.UniversalBot(connector, session => {
    session.sendTyping();
    session.replaceDialog('/menu');
});
// Add recognizer
bot.recognizer(new facebook.CallbackRecognizer());
// Dialogs Waterfall
/*bot.dialog('/', [
    (session) => {
        session.replaceDialog('/menu');
    }
]);*/

bot.dialog('/menu', [
    function (session) {
        session.send("A continuación encontrarás diferentes organizaciones, centros de acopio o formas de ayudar a los afectados o rescatistas del sismo.");
        session.send("Si conoces alguna otra forma de ayudar Contáctanos en Twitter @comoayudarmx o envianos un email a comoayudarmx@gmail.com");
        var choices = ["Listado general", "Filtrado por locación", "Filtrado por tipo de donacion"];
        builder.Prompts.choice(session, "Que accion le gustaria realizar?", choices, { listStyle: builder.ListStyle.button });
    },
    function (session, results) {
        if (results.response) {
            var selection = results.response.entity;
            // route to corresponding dialogs
            switch (selection) {
                case "Listado general":
                    session.replaceDialog('/findAll');
                    break;
                case "Filtrado por locación":
                    session.replaceDialog('/findByLocation');
                    break;
                case "Filtrado por tipo de donacion":
                    session.replaceDialog('/findByDonationType');
                    break;
                default:
                    session.reset('/');
                    break;
            }
        }
    }
]);
// TODO se agregara en cuanto el API de
// bot.dialog('/listFakeNews', [
//     (session, args, next) => {
//         session.sendTyping();
//         // Connected to API
//         let result = api.FakeNewsAll().then(resp => console.log);
//     }
// ]).triggerAction({
//     matches: 'FAKE_NEWS_LIST' // callback facebook payload
// });

bot.dialog('/findAll', [
    (session, args, next) => {
        session.sendTyping();
        // Connected to API
        let result = api.ObtenerTodos();
        session.replaceDialog('/displayResults', { result });
    }
]).triggerAction({
    matches: 'GENERAL_LIST' // callback payload
});

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

bot.dialog('/displayResults',
(session, args, next) => {
    if (args.result) {
        // console.log(args.result)
        var searchResult = args.result;
        if (searchResult.length > 0) {
            // Create Reply Layout
            var reply = new builder.Message(session).attachmentLayout(builder.AttachmentLayout.carousel);
            let cards = searchResult.map((element) => {
                return new builder.HeroCard(session)
                    .title(element.title)
                    .subtitle(element.address)
                    .text(element.description)
                    .buttons([
                        builder.CardAction.openUrl(session, element.link, element.title)
                    ]);
            });
            reply.attachments(cards);
            session.send(reply);
            session.endConversation();
            // session.reset('/');
        } else {
            session.endConversation("Lo siento, no pude obtener información");
            session.reset('/');
        }
    } else {
        session.endConversation("Lo siento, no pude obtener informacion :(");
    }
}
);


// Setup Restify Server
const server = restify.createServer();
/*server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser()); */
server.listen(process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});
server.post('/api/messages', connector.listen());