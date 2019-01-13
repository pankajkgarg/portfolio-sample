const yahooFinance = require('yahoo-finance');

const holdingController = require('./holding.controller');

exports.cumulativeReturns = async function() {
    return holdingController.getAll().then(async (holdings) => {
        let res = {};
        for (let holding of holdings) {
            let stockReturn = await calculateCumulativeReturn(holding.stockCode, holding.avgPrice, holding.quantity);

            if (stockReturn !== null) {
                res[holding.stockCode] = stockReturn;
            }
        }

        return res;
    })
};

async function calculateCumulativeReturn (stockCode, avgPrice, quantity) {
    if (quantity === 0) {
        return null;
    }
    let quotes = await yahooFinance.quote({
        symbol: stockCode,
        modules: ['price', ]
    }).catch(err => null) ;

    if (quotes === null) {
        // Symbol not found in YAHOO finance
        return null;
    }

    let currentPrice = quotes.price.regularMarketPrice;
    let investedValue = parseFloat(avgPrice) * quantity;
    let currentValue = currentPrice * quantity;
    if (investedValue !== 0) {
        return (currentValue - investedValue)/investedValue
    }
    return null;
}

exports.calculateCumulativeReturn = calculateCumulativeReturn;