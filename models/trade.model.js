const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let TradeSchema = new Schema({
    date: {type: 'Date', default: Date.now},
    price: {type: Schema.Types.Decimal, required: true},
    quantity: {type: 'Number', required: true},
    stock: { type: Schema.Types.ObjectId, ref: 'Stock' },
    type: {
        type: 'String',
        enum: ['buy', 'sell'],
        required: true,
    },

});


// Export the model
module.exports = mongoose.model('Trade', TradeSchema);


