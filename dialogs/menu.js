const builder = require("botbuilder");

module.exports = function (bot) {
    bot.dialog('/menu', [
        (session) => {
            let message = "A continuación encontrarás diferentes organizaciones, centros de acopio o formas de ayudar a los afectados o rescatistas del sismo.\nSi conoces alguna otra forma de ayudar Contáctanos en Twitter @comoayudarmx o envianos un email a comoayudarmx@gmail.com ";
            session.send(message); // 2 send generate FB Error
            //session.send("A continuación encontrarás diferentes organizaciones, centros de acopio o formas de ayudar a los afectados o rescatistas del sismo.");
            //session.send("Si conoces alguna otra forma de ayudar Contáctanos en Twitter @comoayudarmx o envianos un email a comoayudarmx@gmail.com");
            var choices = "Listado general|Filtrado por locación|Filtrado por tipo de donacion|Ver FakeNews";
            builder.Prompts.choice(session, "Que accion le gustaria realizar?", choices, { listStyle: builder.ListStyle.button });
        },
     (session, results) => {
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
                    case "Ver FakeNews":
                        session.replaceDialog('/listFakeNews');
                        break;
                    default:
                        session.reset('/');
                        break;
                }
            }
        }
    ]);
}