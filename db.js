var { MongoClient } = require('mongodb');
var url = 'mongodb+srv://admin:admin_123@irr-summit.2e2wz.gcp.mongodb.net/<dbname>?retryWrites=true&w=majority';
var client = new MongoClient(url, { useUnifiedTopology: true });

client.connect(function (err, database) {
    if (err) {
        console.log('connection is not successful')
        process.exit(0);
    }
    exports.db = database.db('infusionsoft');
    require('./bin/www');

})