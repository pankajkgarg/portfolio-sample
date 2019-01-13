
const Trade = require('../models/trade.model');
const Stock = require('../models/stock.model');
const Holding = require('../models/holding.model');

const {addHolding, reduceHolding} = require('./holding.controller');

const TradeType = {
    BUY: "buy",
    SELL: "sell",
};

/**
 *
 * @param data:  Trade info
 * @param data.date:  Date of trade
 * @param data.price:  Avg price per stock of trade
 * @param data.quantity: Number of stocks traded
 * @param data.type:  buy or sell
 * @param data.stockCode:  Stock Code
 * @returns {Promise.<T>} Promise returns an object of form {success, data}
 */
async function addTrade(data){
    // Checking if the stock exists in stocks table
    let stock = await Stock.findOne({code: data.stockCode}).exec()
        .catch(err => null);

    if (stock === null){
        // Creating a new stock if it doesn't exist
        stock = new Stock({
            code: data.stockCode,
            name: data.stockCode,
        });
        await stock.save();
    }

    let trade = new Trade({
        date: data.date,
        price: data.price,
        quantity: data.quantity,
        stock: stock._id,
        type: data.type
    });

    return trade.save()
        .then((savedTrade) => {
            // Update the holdings
            let res = {success: true, data: {tradeId: savedTrade._id}};
            if (trade.type === TradeType.BUY) {
                return addHolding(savedTrade, true)
                    .then(() => res);
            } else if (trade.type === TradeType.SELL){
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
 * @param tradeToRemove._id:  ID of the trade
 * @returns {Promise.<TResult>}  Promise represents the result of the operation {success, data}
 */
function removeTrade(tradeToRemove) {
    return Trade.findOneAndDelete({_id: tradeToRemove._id}).exec()
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
 * @param trade.stockCode:  Stock code
 * @returns {Promise.<TResult>}  Promise represents the result of the operation {success, data}
 */
function updateTrade(trade) {
    // Checking if the trade exists
    return Trade.findOne({_id: trade._id}).populate('stock').exec()
        .then((prevTrade) => {
            if (prevTrade === null) {
                return {success: false, data: {message: "No such trade exists!"}};
            } else {
                // Removing and then adding a new trade
                // This way we can use the existing code for proper handling of Holdings
                return removeTrade(trade)
                    .then((removeTradeResult) => {
                        //console.log("remove trade result", removeTradeResult);
                        if (!removeTradeResult.success) {
                            return removeTradeResult;
                        }

                        let newTrade = Object.assign(prevTrade, trade);
                        newTrade.stockCode = newTrade.stock.code;
                        newTrade.price = newTrade.price.toString();
                        return addTrade(newTrade);
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

/**
 *  Returns all trades
 *
 * @returns {Promise.<TResult>} Promise represents a object with {stockCode: <list of trades>}
 */
function getAll() {
    return Trade.find().populate('stock').exec()
        .then((trades) => {
            let result = {};
            for (let trade of trades) {
                if (!trade.stock) {
                    continue;
                }

                if (!(trade.stock.code in result )) {
                    result[trade.stock.code] = [];
                }
                result[trade.stock.code].push({
                    id: trade._id,
                    type: trade.type,
                    price: trade.price.toString(),
                    quantity: trade.quantity,
                })
            }
            return result;

        })
};


module.exports = {addTrade, updateTrade, removeTrade, getAll};


