'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var contentSchema = new Schema(
    {
        "legacy_id": Number,
        "name": String,
        "url_alias": String,
        "market_segment": Number,
        "state": String
});

module.exports = mongoose.model( 'make', contentSchema );
