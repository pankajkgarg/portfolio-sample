
const Holding = require('../models/holding.model');


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

                    holding.avgPrice = (prevTotalPrice + currentTradeValue)/totalQuantity;
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

                    holding.avgPrice = (prevTotalPrice - currentTradeValue)/totalQuantity;
                }

                holding.quantity -= quantity;

                return Holding.updateOne({_id: holding._id}, holding).exec();
            }

        })
};




