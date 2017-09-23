const api = require("../consumer");
const assert = require('assert');
describe('Array', function() {
  describe('Pruebas de Consumer-Card', function() {
    it('Obtener todos los registros de los centros de acopio', function() {
        let records = api.ObtenerTodos();
        assert.equal(records.length > 0, true, `Registros obtenidos ${records.length}`);
    });

    it('Consumir Fake News', function(done) {
      api.FakeNewsAll().then(resp => {
        if (err) done(err);
        done();
      });
  });
  });
});