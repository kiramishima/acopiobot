// Script que consume los datos del JSON de http://comoayudar.mx
const jsondata = require("./cards");
const _ = require("lodash");

function getAll () {
    return jsondata;
}
function getDonationTypes () {
    return Array.from(new Set(_.flatten(_.map(jsondata, n => n.type))))
}

function getLocations () {
    return Array.from(new Set(_.flatten(_.map(jsondata, n => n.location))));
}

function filterByDonationType (donationType) {
    return _.filter(jsondata, {type: donationType});
}

function filterByLocation (location) {
    return _.filter(jsondata, {location: location});
}
module.exports = {
    ObtenerTodos: getAll,
    DonationTypes: getDonationTypes,
    FilterByDonationType: filterByDonationType,
    Locations: getLocations,
    FilterByLocation: filterByLocation
}