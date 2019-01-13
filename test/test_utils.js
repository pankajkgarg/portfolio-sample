const mongoose = require('mongoose');
//tell mongoose to use es6 implementation of promises
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/test_portfolio');
mongoose.connection
    .once('open', () => {
        console.log('Connected!');
        //done();
    })
    .on('error', (error) => {
        console.warn('Error : ',error);
        //done();
    });

//Called hooks which runs before something.

function before(done){
    console.log("Connecting to mongo")


}

async function clearDatabase(done){
    if (mongoose.connection.db) {
        const collections = await mongoose.connection.db.collections();

        for (let collection of collections) {
            await collection.deleteOne()
        }
        console.log("Database cleared");
        done && done()
    }

};

module.exports = {clearDatabase};
