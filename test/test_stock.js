const assert = require('assert');
const chai = require('chai');
const chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);

const expect = chai.expect
    , should = chai.should();

const {clearDatabase} = require('./test_utils');
const Stock = require('../models/stock.model');


describe('Stocks', () => {
    after( (done) =>  {
        clearDatabase(done)
    });

    it('creates a stock', (done) => {

        const stock = new Stock({ name: 'HDFC Bank', code: "HDFCBANK" });
        stock.save()
            .then(() => {
                assert(!stock.isNew);
                done();
            });
    });

    it('ensure that duplicate can\'t be created', (done) => {
        const stock = new Stock({ name: 'HDFC Bank', code: "HDFCBANK" });
        stock.save().should.be.rejected.notify(done);
    })
});