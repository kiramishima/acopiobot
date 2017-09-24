// Consumer del Backend
const cards = require("./Cards");
const request = require('request');
const _ = require("lodash");

function getAll () {
    return cards.GetCards();
}
function getDonationTypes () {
    return cards.GetCards().then(resp => {
        return Promise.resolve(Array.from(new Set(_.flatten(_.map(resp, n => n.type)))))
    });
}

function getLocations () {
    return cards.GetCards().then(function (resp) {
        return Promise.resolve(Array.from(new Set(_.flatten(_.map(resp, n => n.location)))));
    });
}

function filterByDonationType (donationType) {
    return cards.GetCards().then(resp => {
        return Promise.resolve(_.filter(resp, {type: [donationType]}));
    });
}

function filterByLocation (location) {
    // return _.filter(jsondata, {location: location});
    return cards.GetCards().then(resp => {
        return Promise.resolve(_.filter(resp, {location: location}));
    });
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
    GetAll: getAll,
    DonationTypes: getDonationTypes,
    FilterByDonationType: filterByDonationType,
    Locations: getLocations,
    FilterByLocation: filterByLocation,
    FakeNewsAll: getFakeNews,
    FakeNewsById: getFakeNewsById
}