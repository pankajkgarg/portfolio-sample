const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let StockSchema = new Schema({
    name: {type: 'String', required: true},
    code: {type: 'String', required: true, unique: true,},
});


// Static methods
StockSchema.statics = {

}


// Export the model
module.exports = mongoose.model('Stock', StockSchema);


