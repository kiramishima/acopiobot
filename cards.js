const rp = require('request-promise');
var getCards = function() {
    var getEntryProperty = function(entry, propName) {
        return entry['gsx$' + propName] && entry['gsx$' + propName]['$t']
    }

    var formatType = function(type) {
        var types = type.split(',');

        return types.map(function(type) {
            return type.trim();
        });
    }

    var isApprovedCard = function(card) {
        return card.approved;
    }

    var buildCard = function(entry) {
        return {
            timespamp: new Date(getEntryProperty(entry, 'timestamp')),
            title: getEntryProperty(entry, 'formadeayuda'),
            description: getEntryProperty(entry, 'informaciónadicionaldeayuda'),
            type: formatType(getEntryProperty(entry, 'tipodedonación')),
            location: getEntryProperty(entry, 'puedesayudardesde'),
            link: getEntryProperty(entry, 'fuentedeinformaciónlink'),
            adicional: getEntryProperty(entry, 'informaciónadicional'),
            verified: Boolean(getEntryProperty(entry, 'verified')),
            approved: getEntryProperty(entry, 'approved') === 'TRUE' ? true : false
        }
    }

    return rp({
            uri: "https://spreadsheets.google.com/feeds/list/1zAFK1sSjIaHurnKzLx-e3GJZNmZ9QWfFSlIZLyYk8IE/olipwxe/public/values?alt=json",
            json: true
        })
        .then(function(data) {
            // console.log({data})
            return Promise.resolve(data.feed.entry.map(buildCard).filter(isApprovedCard))
        })
        .catch(function(err) {
            // Crawling failed...
            return Promise.reject(err);
        });
}

var getCardTypes = function(card) {
    if (Array.isArray(card.type)) {
        return card.type;
    }
    return [card.type];
}

module.exports = {
    GetCards: getCards,
    GetCardTypes: getCardTypes
}