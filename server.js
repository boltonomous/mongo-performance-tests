'use strict';

// Constants
var express = require('express'),
      dbUtils = require('./services/dbUtils'),
      vehiclemake = require('./models/make'),
      vehiclemodel = require('./models/model');

// App
const app = express();
app.listen(3000);
console.log('Running on http://localhost:' + 3000);

// Connecting to DB
dbUtils.connect();

// VARIABLE CACHING
var localModelsMap = new Map(),
    localMakesMap = new Map();

// Health Check
app.get('/', function (req, res) {
    res.json( {
        'healthcheck': 200
    });
});

// Load test verification
app.get('/loaderio-6aa5865fcc6178a51838d5da318bac81', function(req, res) {
   res.end('loaderio-6aa5865fcc6178a51838d5da318bac81');
});

// Manually Fetch and Join Makes to Models
app.get('/api/modelsWithMakesPopulate', function( req, res ) {
    vehiclemodel.find().populate('make').exec(function(err, data) {
        if (err) {
           return res.statusCode(500).json( { status: 500});
        }
        res.json( {"status":200,"metadata": { "count": data.length}, "data": data} );
    });
});

// Manually Fetch Models, NO JOIN
app.get('/api/getModels', function( req, res ) {
    vehiclemodel.find().exec(function(err, data) {
        if (err) {
            return res.statusCode(500).json( { status: 500});
        }
        res.json( {"status":200,"metadata": { "count": data.length}, "data": data} );
    });
});

// Manually Fetch Models JOIN from LOCAL CACHE
app.get('/api/getModelsCached', function( req, res ) {
    let modifiedData = JSON.parse( JSON.stringify( Array.from( localModelsMap.values() ) ) );
    for (let i in modifiedData) {
        let row = modifiedData[ i ];
        modifiedData[ i ].make = localMakesMap.get( String(row.make) );
    }
    return res.json( modifiedData )
});

app.get('/api/updateIds', function( req, res ) {
    vehiclemake.find().exec(function(err, data) {
        if (err) {
            return res.statusCode(500).json( { status: 500});
        }

        // manual join
        for ( var i in data ) {
            vehiclemodel.update({ make_id: data[i].legacy_id }, { "make": data[i]._id }, { multi: true }, function(err) {
                if(err) { throw err; }
            });
        }
        res.json( {"status": 200, "message": "done" } );

    });
});

function cacheMakes() {
    vehiclemake.find().exec( function( err, data ) {
        if ( err ) {
            return false;
        }

        // clear it
        localMakesMap.clear();

        // populate it;
        for ( var i in data ) {
            let row = data[i];
            localMakesMap.set( String( row._id ), row )
        }
        console.log(`Cached ${localMakesMap.size} Vehicle Makes`)
    });
}

function cacheModels() {
    vehiclemodel.find().exec( function( err, data ) {
        if ( err ) {
            return false;
        }

        // clear it
        localModelsMap.clear();

        // populate it
        for ( var i in data ) {
            let row = data[i];
            localModelsMap.set( String( row._id ), row )
        }
        console.log(`Cached ${localModelsMap.size} Vehicle Models`)
    });
}
cacheMakes();
cacheModels();
