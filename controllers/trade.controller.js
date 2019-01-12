
const Trade = require('../models/trade.model');
const Holding = require('../models/holding.model');

const {addHolding, reduceHolding} = require('./holding.controller');

const TradeType = {
    BUY: "buy",
    SELL: "sell",
};

/**
 *
 * @param trade:  Trade info
 * @param trade.date:  Date of trade
 * @param trade.price:  Avg price per stock of trade
 * @param trade.quantity: Number of stocks traded
 * @param trade.type:  buy or sell
 * @param trade.stock:  Stock ID
 * @returns {Promise.<T>} Promise returns an object of form {success, data}
 */
function addTrade(trade){
    let trade = new Trade({
        date: data.date,
        price: data.price,
        quantity: data.quantity,
        stock: data.stockId,
        type: data.type
    });

    return trade.save()
        .then((savedTrade) => {
            // Update the holdings
            let res = {success: true, data: {tradeId: savedTrade._id}};
            if (data.type === TradeType.BUY) {
                return addHolding(savedTrade, true)
                    .then(() => res);
            } else if (data.type === TradeType.SELL){
                return reduceHolding(savedTrade, false)
                    .then(() => res);
            }

        }).catch((err) => {
            return {success: false}
        })

}

/**
 *
 * @param tradeToRemove:  Trade object to remove
 * @param trade._id:  ID of the trade
 * @returns {Promise.<TResult>}  Promise represents the result of the operation {success, data}
 */
function removeTrade(tradeToRemove) {
    return Trade.findOneAndDelete({_id: trade._id}).exec()
        .then( (trade) => {
            let res = {data: {}};

            if (trade === null) {
                res.success = false;
                res.data.message = "No such trade found";
                return res;
            } else {
                res.success = true;
                res.data.message = "Trade removed";

                // Updating the holdings
                if (trade.type === TradeType.BUY) {
                    // updating the avgPrice
                    return reduceHolding(trade, true)
                        .then(() => res);
                } else {
                    return addHolding(trade, false)
                        .then(() => res);
                }
            }

        }).catch((err) => {
            return {
                success: false,
                data: {message: "Failed to remove trade"}
            }
        })
}

/**
 *
 * @param trade:  Updated trade info
 * @param trade._id:  ID of the trade to update
 * @param trade.date:  Date of trade
 * @param trade.price:  Avg price per stock of trade
 * @param trade.quantity: Number of stocks traded
 * @param trade.type:  buy or sell
 * @param trade.stock:  Stock ID
 * @returns {Promise.<TResult>}  Promise represents the result of the operation {success, data}
 */
function updateTrade(trade) {
    // Checking if the trade exists
    return Trade.findOne({_id: trade._id}).exec()
        .then((prevTrade) => {
            if (prevTrade === null) {
                return {success: false, data: {message: "No such trade exists!"}};
            } else {
                // Removing and then adding a new trade
                // This way we can use the existing code for proper handling of Holdings
                removeTrade(trade)
                    .then((removeTradeResult) => {
                        if (!removeTradeResult.success) {
                            return removeTradeResult;
                        }

                        return addTrade(trade);
                    });
            }
        }).catch((err) => {
            return {success: false, data: {message: "Failed to update trade"}};
        })

    /*
        let res = {data: {}};
            if (updateInfo.n === 1) {
                res.success = true;
                res.data.message = "Trade modified successfully";
            } else {
                res.success = false;
                res.data.message = "No such trade exist";
            }
            return res;
     */
}

module.exports = {addTrade, updateTrade, removeTrade};


