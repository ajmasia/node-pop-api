require('dotenv').config();

const request = require('supertest');
const app = require('../app');
const token = process.env.TOKEN_TEST;

describe('Ads authorization', function () {

    it('Should require authorization', function(done) {
        request(app)
            .get('/apiv1/ads')
            .expect(401)
            .end(function(err, res) {
                if (err) return done(err);
                done();
            });
    });

    it('Should respond with JSON array', function(done) {
        request(app)
            .get('/apiv1/ads')
            .set('Authorization', 'bearer ' + token)
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function(err, res) {
                if (err) return done(err);
                done();
            });
    });

});

describe('Users authorizartion', function () {

    it('Should require authorization', function(done) {
        request(app)
            .get('/apiv1/users')
            .expect(401)
            .end(function(err, res) {
                if (err) return done(err);
                done();
            });
    });

    it('Should respond with JSON array', function(done) {
        request(app)
            .get('/apiv1/users')
            .set('Authorization', 'bearer ' + token)
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function(err, res) {
                if (err) return done(err);
                done();
            });
    });
});

describe('Index access', function () {

    it('Should not require authorization', function(done) {
        request(app)
            .get('/')
            .expect(200)
            .end(function(err, res) {
                if (err) return done(err);
                done();
            });
    });

    it('Should not require authorization', function(done) {
        request(app)
            .get('/')
            .expect(200)
            .end(function(err, res) {
                if (err) return done(err);
                done();
            });
    });

    it('Should not require authorization', function(done) {
        request(app)
            .get('/lang/es')
            .expect(302)
            .end(function(err, res) {
                if (err) return done(err);
                done();
            });
    });

    it('Should not require authorization', function(done) {
        request(app)
            .get('/lang/en')
            .expect(302)
            .end(function(err, res) {
                if (err) return done(err);
                done();
            });
    });
});


