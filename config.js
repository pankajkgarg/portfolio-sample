
const defaults = {
    db: 'mongodb://127.0.0.1/portfolio',
};

const development = {
    db: 'mongodb://127.0.0.1/portfolio-dev',
    testDb: 'mongodb://127.0.0.1/portfolio-test',
};

const production = {
    
};

module.exports = {
    development: Object.assign({}, development, defaults),
    //test: Object.assign({}, test, defaults),
    production: Object.assign({}, production, defaults)
}[process.env.NODE_ENV || 'development'];