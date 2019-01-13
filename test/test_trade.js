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
const Trade = require('../models/trade.model');



const portfolioController = require('../controllers/portfolio.controller');
const tradeController = require('../controllers/trade.controller');


describe('Trades', () => {
    const hdfc = { name: 'HDFC Bank', code: "HDFCBANK", _id: mongoose.Types.ObjectId() };
    const reliance = { name: 'Reliance', code: "RELIANCE", _id: mongoose.Types.ObjectId() };

    before(async () => {
        await clearDatabase()

        //await new Stock(hdfc).save().catch(err => {});
        //await new Stock(reliance).save().catch(err => {});
        //done()
    })

    after((done) =>  {
        clearDatabase(done)
    });

    it('adds a trade', async () => {
        await tradeController.addTrade({stockCode: hdfc.code, quantity: 10, price: 100, type: 'buy'});

        let stock = await Stock.findOne({code: hdfc.code}).exec();
        assert.notEqual(stock, null);

        let holding = await Holding.findOne({stock: stock._id}).exec();
        assert(holding, "Holding not found")
        holding.should.have.property('quantity').to.equal(10);



        let trade = await Trade.findOne({stock: stock._id}).exec();
        assert(trade, "Trade not found");
        assert.equal(trade.quantity, 10);

    });

    it('removes a trade', async () => {
        await tradeController.addTrade({stockCode: reliance.code, quantity: 10, price: 100, type: 'buy'});

        let stock = await Stock.findOne({code: reliance.code}).exec();
        assert.notEqual(stock, null);

        let trade = await Trade.findOne({stock: stock._id}).exec();

        await tradeController.removeTrade({_id: trade._id});

        let holding = await Holding.findOne({stock: stock._id}).exec();
        assert(holding, "Holding not found")
        assert.equal(holding.quantity, 0);

        assert.equal(holding.avgPrice, 0);



    });


});