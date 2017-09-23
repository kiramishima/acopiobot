module.exports = function (bot) {
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
}