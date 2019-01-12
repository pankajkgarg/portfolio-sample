const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let HoldingSchema = new Schema({
    stock: { type: Schema.Types.ObjectId, ref: 'Stock', unique: true, required: true, },
    quantity: {type: 'Number', required: true},
    avgPrice: {type: Schema.Types.Decimal, required: true},
});


// Export the model
const Holding = mongoose.model('Holding', HoldingSchema);

module.exports = Holding;

