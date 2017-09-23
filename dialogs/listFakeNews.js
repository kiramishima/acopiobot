const builder = require("botbuilder");
const api = require("../consumer");

module.exports = function (bot) {
    bot.dialog('/listFakeNews', [
        (session, args, next) => {
            session.sendTyping();
            // Connected to API
            let result = api.FakeNewsAll().then(resp => {
                if (resp.length > 0) {
                    // Create Reply Layout
                    var reply = new builder.Message(session).attachmentLayout(builder.AttachmentLayout.carousel);
                    let cards = resp.map((element) => {
                        return new builder.HeroCard(session)
                            .title(element.fake_news_title)
                            .subtitle(element.url_source_fake_news)
                            .text(element.possible_text_fake_news)
                            .buttons([
                                builder.CardAction.openUrl(session, element.url_refute, "Ver")
                            ]);
                    });
                    reply.attachments(cards);
                    session.send(reply);
                    session.endConversation();
                } else {
                    session.endConversation("Lo siento, no pude obtener información");
                }
            });
        }
    ]).triggerAction({
        matches: 'FAKE_NEWS_LIST' // callback facebook payload
    });
}