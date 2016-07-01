'use strict';

const mongoose = require('mongoose');
var connectionString = process.argv[3] || process.env.FE_DATABASE_CN || 'mongodb://localhost/vehicletaxonomy';

// db connection logging
mongoose.connection.on('connected', function () {
    console.log('Mongoose default connection open to ' + connectionString);
});

mongoose.connection.on('error', console.error.bind(console, 'connection error:'));

// connect db
module.exports = {

    /**
     * Connect to the Database
     * @param connectionStringOverride - optional connection string, defaults to local db
     */
    connect: function( connectionStringOverride ) {

        // set default connection string
        if ( connectionStringOverride ) {
            connectionString = connectionStringOverride;
        }

        // connect to db
        mongoose.connect( connectionString );
    }
};
