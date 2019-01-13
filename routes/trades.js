const express = require('express');
const router = express.Router();

const Trade = require('../models/trade.model');

/* Add a Trade. */
router.post('/addTrade', function(req, res, next) {
    let trade = new Trade({
        date: req.body.date,
        price: req.body.price,
        quantity: req.body.quantity,
        stockCode: req.body.stockCode,
        type: req.body.type
    });

    trade.save(function (err, trade) {
        let response = {
            'success': true,
            'data': {},
        };
        if (err) {
            response['success'] = false;
            // return next(err);
        } else {
            response["data"] = {"id": trade._id};
        }

        res.send(JSON.stringify(response));
    });
});

/* Update Trade. */
router.post('/updateTrade', function(req, res, next) {
    res.send('respond with a resource');
});


/* Delete Trade. */
router.post('/removeTrade', function(req, res, next) {
    Trade.deleteOne({_id: req.body.tradeId}, function (err) {
        let response = {
            'success': true,
            'data': {},
        };
        if (err) {
            response['success'] = false;
            // return next(err);
        } else {
            // response["data"] = {"id": trade._id};
        }

        res.send(JSON.stringify(response));
    });
});


module.exports = router;
