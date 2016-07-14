'use strict';

var app = require('../..');
import request from 'supertest';

describe('Payment API:', function() {

  describe('GET /api/payments', function() {
    var payments;

    beforeEach(function(done) {
      request(app)
        .get('/api/payments')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          payments = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      payments.should.be.instanceOf(Array);
    });

  });

});
