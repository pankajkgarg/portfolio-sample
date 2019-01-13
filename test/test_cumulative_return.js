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



const {calculateCumulativeReturn, cumulativeReturns} = require('../controllers/cumulative_return.controller');


describe('Cumulative Returns', () => {
    before(async () => {
        await clearDatabase()

    })

    after((done) =>  {
        clearDatabase(done)
    });

    it('checks calculateCumulativeReturn', async function()  {
        this.timeout(10000);

        let res = await calculateCumulativeReturn("RELIANCE.BO", 100, 10);

        console.log(res);
        assert(res, "Yahoo finance query failed");
        assert(res > 1, "Cum return not working");

    });



});