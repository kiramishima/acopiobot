const builder = require("botbuilder");

module.exports = function (bot) {
    bot.dialog('/displayResults', [
        (session, args, next) => {
            if (args.result) {
                var searchResult = args.result;
                if (searchResult.length > 0) {
                    // Create Reply Layout
                    var reply = new builder.Message(session).attachmentLayout(builder.AttachmentLayout.carousel);
                    let cards = searchResult.map((element) => {
                        return new builder.HeroCard(session)
                            .title(element.title)
                            .subtitle(element.adicional)
                            .text(element.description)
                            .buttons([
                                builder.CardAction.openUrl(session, element.link, element.title)
                            ]);
                    });
                    reply.attachments(cards);
                    session.send(reply);
                    session.endConversation();
                } else {
                    session.endConversation("Lo siento, no pude obtener información");
                }
            } else {
                session.endConversation("Lo siento, no pude obtener informacion :(");
            }
        }
    ]);
}