// Script que consume los datos del JSON de http://comoayudar.mx
const jsondata = require("./cards");
const request = require('request');
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
/** Consume el API de https://banfakenews.rzerocorp.com/ */
function getFakeNews () {
    return new Promise((resolve, reject) => {
        request.get({
            url: `https://banfakenews.rzerocorp.com/api/v1/reports/`,
            json: true
        }, (err, res) => {
            resolve(res.body)
        })
    });
}
function getFakeNewsById (id) {
    return new Promise((resolve, reject) => {
        request.get({
            url: `https://banfakenews.rzerocorp.com/api/v1/reports/view/${id}`
        }, (err, res) => {
            resolve(res.body)
        })
    });
}
module.exports = {
    ObtenerTodos: getAll,
    DonationTypes: getDonationTypes,
    FilterByDonationType: filterByDonationType,
    Locations: getLocations,
    FilterByLocation: filterByLocation,
    FakeNewsAll: getFakeNews,
    FakeNewsById: getFakeNewsById
}