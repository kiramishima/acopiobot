const restify = require("restify");
const builder = require("botbuilder");
const api = require("./consumer");
// Create chat connector for communicating with the Bot Framework Service
const connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
// Create Bot Instance
const bot = new builder.UniversalBot(connector);

// Dialogs Waterfall
bot.dialog('/', [
    (session) => {
        session.replaceDialog('/menu');
    }
]);

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
                    // session.replaceDialog('/findByLocation');
                    break;
                case "Filtrado por tipo de donacion":
                    // session.replaceDialog('/findByType');
                    break;
                default:
                    session.reset('/');
                    break;
            }
        }
    }
]);

bot.dialog('/findAll', [
    (session, args, next) => {
        // Connected to API
        api.ObtenerTodos().then(result => {
            session.replaceDialog('/displayResults', { result });
        })
        .catch(error => {
            session.send("No se pudo encontrar informacion");
            session.send(error);
            session.endConversation();
        });
    }
]);

bot.dialog('/displayResults',
(session, args, next) => {
    if (args.result) {
        console.log(args.result)
        var searchResult = JSON.parse(args.result);
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
    } else {
        session.endConversation("Lo siento, no pude obtener informacion :(");
    }
}
);


// Setup Restify Server
const server = restify.createServer();
server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser()); 
server.listen(process.env.port || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});
server.post('/api/messages', connector.listen());