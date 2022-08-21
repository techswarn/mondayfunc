const jwt = require('jsonwebtoken');
const mondayService = require('./services/monday-service');

// Function starts here.
async function main(args) {

    
    const client_secret = process.env['MONDAY_SIGNING_SECRET'];
    

    // Instantiates a connection to the database and retrieves data from the `available-coffee` collection
    try {
        const reqHeaders = args.__ow_headers;
        authenticateToken(args);
        // const { shortLivedToken } = req.session;
        // const { payload } = req.body;
        return {
            "body": client_secret + '<br/>' + JSON.stringify(args),
            statusCode: 200
        };
    } catch (e) {
        console.error(e);
        return {
            "body": { "error": "There was a problem retrieving data." },
            "statusCode": 400
        };
    } finally {
        
    }
}


const authenticateToken = async (req) =>  {
    try {
        let { authorization } = req.__ow_headers;
        if (!authorization && req.query) {
          authorization = req.query.token;
        }
        const { accountId, userId, backToUrl, shortLivedToken } = jwt.verify(
          authorization,
          process.env['MONDAY_SIGNING_SECRET']
        );
        req.session = { accountId, userId, backToUrl, shortLivedToken };
        
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'not authenticated' });
      }
}

// IMPORTANT: Makes the function available as a module in the project.
// This is required for any functions that require external dependencies.
module.exports.main = main;