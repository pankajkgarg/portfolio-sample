const assert = require('assert');
const mongoose = require('mongoose');
const chai = require('chai');
const chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);

const expect = chai.expect
    , should = chai.should();

const {clearDatabase} = require('./test_utils');
const Stock = require('../models/stock.model');
const Holding = require('../models/holding.model');

const {addHolding, reduceHolding} = require('../controllers/holding.controller');

const portfolioController = require('../controllers/portfolio.controller');
const tradeController = require('../controllers/trade.controller');


describe('Holdings', () => {
    const hdfc = { name: 'HDFC Bank', code: "HDFCBANK", _id: mongoose.Types.ObjectId() };
    const reliance = { name: 'Reliance', code: "RELIANCE", _id: mongoose.Types.ObjectId() };

    before(async () => {
        await clearDatabase()

        await new Stock(hdfc).save().catch(err => {});
        await new Stock(reliance).save().catch(err => {});
        //done()
    })

    after((done) =>  {
        clearDatabase(done)
    });

    it('adds a holding', async () => {
        await addHolding({stock: hdfc._id, quantity: 10, price: 100}, true);

        let holding = await Holding.findOne({stock: hdfc._id}).exec();
        holding.should.have.property('quantity').to.equal(10)
    });
    it('adds another holding', async () => {
        await addHolding({stock: hdfc._id, quantity: 10, price: 100}, true);

        let holding = await Holding.findOne({stock: hdfc._id}).exec();
        assert.equal(holding.quantity, 20);
        assert.equal(holding.avgPrice, 100);


    });
    it('checks avgPrice', async () => {
        await addHolding({stock: hdfc._id, quantity: 20, price: 200}, true);

        holding = await Holding.findOne({stock: hdfc._id}).exec();
        assert.equal(holding.quantity, 40);
        assert.equal(holding.avgPrice, 150);

        //done();
    });

    it('avgPrice should not change', async () => {
        await addHolding({stock: hdfc._id, quantity: 20, price: 200}, false);

        holding = await Holding.findOne({stock: hdfc._id}).exec();
        assert.equal(holding.quantity, 60);
        assert.equal(holding.avgPrice, 150);

        //done();
    });

    it('reduce a holding', async () => {
        await reduceHolding({stock: hdfc._id, quantity: 20, price: 100}, false);

        let holding = await Holding.findOne({stock: hdfc._id}).exec();
        assert.equal(holding.quantity, 40);
        assert.equal(holding.avgPrice, 150);
    });

    it('verify avgPrice on reducing holding', async () => {
        await reduceHolding({stock: hdfc._id, quantity: 20, price: 200}, true);

        holding = await Holding.findOne({stock: hdfc._id}).exec();
        assert.equal(holding.quantity, 20);
        assert.equal(holding.avgPrice, 100);

        //done();
    });

});