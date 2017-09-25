const restify = require("restify");
const builder = require("botbuilder");
const facebook = require('botbuilder-facebookextension');

// Create chat connector for communicating with the Bot Framework Service
const connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
// Create Bot Instance
const bot = new builder.UniversalBot(connector, session => {
    session.sendTyping();
    session.beginDialog('/menu');
});
// Bot Logging
// Middleware for logging
const logUserConversation = (event) => {
    console.log('message: ' + event.text + ', user: ' + event.address.user.name);
};
bot.use({
    receive: function (event, next) {
        logUserConversation(event);
        next();
    },
    send: function (event, next) {
        logUserConversation(event);
        next();
    }
});
// Add recognizer
bot.recognizer(new facebook.CallbackRecognizer());

// Sub-Dialogs
require('./dialogs/menu')(bot);
require('./dialogs/findAll')(bot);
require('./dialogs/findByLocation')(bot);
require('./dialogs/findByDonationType')(bot);
require('./dialogs/displayResults')(bot);
require('./dialogs/listFakeNews')(bot);

// Setup Restify Server
const server = restify.createServer();
server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());
server.listen(process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});
server.post('/api/messages', connector.listen());

server.get('/', function (req, res) {
    res.json(200, {status: "Ok"});
});