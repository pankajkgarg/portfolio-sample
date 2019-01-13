### Portfolio API ###

#### Refer to  problem_statement.pdf for more details ####


To run the service use  `yarn start`

To run the tests use `yarn test`


#### Design Decisions ####

1. Creating three models :  Stocks, Trades and Holdings
    
2. To return a portfolio
    All trades from trade model will be returned.
    All holdings from holding model will be returned.
    
3. Not keeping holdings and trades together in a Portfolio model. 
    Because that will make each trade a sub-document. And it will be difficult to delete individual trades.
    
Config is kept in the config.js file.

For cumulative returns to work, the stock symbols used must match Yahoo Finance stock symbols.


#### Further Possibilities ####
Adding an API to add stocks or list stocks  
