require('dotenv').config();
const request = require('supertest');
const { expect } = require('chai')
const app = require('../app');

describe('Ads', function () {
    it('Should return 200 status', function (done) {
        request(app)
            .get('/apiv1/ads')
            .expect(200, done);
    });
});