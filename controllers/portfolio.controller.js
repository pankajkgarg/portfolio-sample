const Trade = require('../models/trade.model');
const Holding = require('../models/holding.model');

const holdingController = require('./holding.controller');
const tradeController = require('./trade.controller');


/**
 *  Returns all trades and holdings
 *
 * @returns {Promise.<TResult>} Promise represents a object with trades and holdings
 */
exports.get = function() {
    return tradeController.getAll().then((trades) => {
        return holdingController.getAll().then((holdings) => {
            return {trades: trades, holdings: holdings};
        })
    })
};




