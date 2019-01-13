const express = require('express');
const router = express.Router();

const portfolioController = require('../controllers/portfolio.controller');
const holdingController = require('../controllers/holding.controller');
const {addTrade, updateTrade, removeTrade}  = require('../controllers/trade.controller');

const {calculateCumulativeReturn, cumulativeReturns} = require('../controllers/cumulative_return.controller');


router.get('/', function(req, res, next) {
    portfolioController.get()
        .then(response => res.json(response))
        .catch(err => res.json({success: false}));
});

router.get('/holdings', (req, res, next) => {
    holdingController.getAll()
        .then(response => res.json(response))
        .catch(err => res.json({success: false}));
});

router.get('/returns', (req, res, next) => {
    cumulativeReturns()
        .then(response => res.json(response))
        .catch(err => res.json({success: false}));
});



function processTradeRequest(requestProcessor, req, res, next) {
    //console.log(req.body.trade);
    requestProcessor(req.body.trade)
        .then(response => res.json(response))
        .catch(err => res.json({success: false}));
}

router.post('/addTrade', (req, res, next) => {
    processTradeRequest(addTrade, req, res, next);
});

router.post('/updateTrade', (req, res, next) => {
    processTradeRequest(updateTrade, req, res, next);
});
router.post('/removeTrade', (req, res, next) => {
    processTradeRequest(removeTrade, req, res, next);
});



module.exports = router;
