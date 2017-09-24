const api = require("../consumer");
const assert = require('assert');
describe('Array', function() {
    describe('Consumer-Card', function() {
        it('Obtener todos los registros de los centros de acopio', function(done) {
            let records = api.GetAll().then(resp => {
                done();
            });
        });

        it('Obtener Tipos de Donacion', function(done) {
            let records = api.DonationTypes().then(resp => {
                console.log({
                    resp
                })
                done();
            });
            // assert.equal(records.length > 0, true, `Registros obtenidos ${records.length}`);
        });

        it('Obtener Locaciones', function(done) {
            let records = api.Locations().then(resp => {
                console.log({
                    resp
                })
                done();
            });
            // assert.equal(records.length > 0, true, `Registros obtenidos ${records.length}`);
        });

        it('Filtro por Tipo de Donacion', function(done) {
            let records = api.FilterByDonationType("Monetaria").then(resp => {
                console.log({
                    resp
                })
                done();
            });
            // assert.equal(records.length > 0, true, `Registros obtenidos ${records.length}`);
        });

        it('Filtro por Locacion', function(done) {
            let records = api.FilterByLocation("León").then(resp => {
                console.log({
                    resp
                })
                done();
            });
            // assert.equal(records.length > 0, true, `Registros obtenidos ${records.length}`);
        });

        it('Consumir Fake News', function(done) {
            api.FakeNewsAll().then(resp => {
                done();
            });
        });
    });
});