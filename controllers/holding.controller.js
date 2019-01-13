
const Holding = require('../models/holding.model');

/**
 *  Function adds a stock or increase its quantity in holdings
 *
 * @param stock: ID of stock
 * @param quantity: Quantity to add
 * @param price:  Price of the stock
 * @param {boolean} updateAvgPrice: Should the avgPrice be updated
 * @returns {Promise.<TResult>} Promise represents the result of the save or updateOne operation in mongoose
 */
exports.addHolding = function({stock, quantity, price}, updateAvgPrice = true) {
    return Holding.findOne({stock: stock}).exec()
        .then((holding) => {

            if (holding === null) {
                // No previous holding exist for this stock
                let newHolding = new Holding({
                    stock: stock,
                    quantity: quantity,
                    avgPrice: price,
                });

                return newHolding.save();
            } else {
                // Updating existing holding

                if (updateAvgPrice) {
                    let prevTotalPrice = (holding.quantity * holding.avgPrice);
                    let currentTradeValue = quantity * price;
                    let totalQuantity = holding.quantity + quantity;

                    if (totalQuantity != 0) {
                        holding.avgPrice = (prevTotalPrice + currentTradeValue) / totalQuantity;
                    } else {
                        holding.avgPrice = 0;
                    }

                }

                holding.quantity += quantity;

                return Holding.updateOne({_id: holding._id}, holding).exec()
                    /*.then((holdingUpdateInfo) => {
                        return true;
                    })
                    */
            }

        })
};

/**
 *  Function reduces the holding of a stock in holdings
 *
 * @param stock: ID of stock
 * @param quantity: Quantity to add
 * @param price:  Price of the stock
 * @param {boolean} updateAvgPrice: Should the avgPrice be updated
 * @returns {Promise.<TResult>} Promise represents the result of the save or updateOne operation in mongoose
 */
exports.reduceHolding = function({stock, quantity, price}, updateAvgPrice = false) {
    return Holding.findOne({stock: stock}).exec()
        .then((holding) => {

            if (holding === null) {
                // No previous holding exist for this stock
                let newHolding = new Holding({
                    stock: stock,
                    quantity: -1 * quantity,
                    avgPrice: 0,
                });

                return newHolding.save();
            } else {
                // Updating existing holding

                if (updateAvgPrice) {
                    let prevTotalPrice = (holding.quantity * holding.avgPrice);
                    let currentTradeValue = quantity * price;
                    let totalQuantity = holding.quantity - quantity;

                    if (totalQuantity != 0) {
                        holding.avgPrice = (prevTotalPrice - currentTradeValue) / totalQuantity;
                    } else {
                        holding.avgPrice = 0;
                    }

                }

                holding.quantity -= quantity;

                return Holding.updateOne({_id: holding._id}, holding).exec();
            }

        })
};


/**
 *  Returns all holdings
 *
 * @returns {Promise.<TResult>} Promise represents a list of holdings
 */
exports.getAll = function() {
    return Holding.find({quantity : {$ne: 0}}).populate('stock').exec()
        .then((holdings) => {
            let modHoldings = [];
            for (let holding of holdings) {
                modHoldings.push({
                    stockCode: holding.stock ? holding.stock.code : null,
                    quantity: holding.quantity,
                    avgPrice: holding.avgPrice.toString(),
                })
            }
            return modHoldings;

        })
};





