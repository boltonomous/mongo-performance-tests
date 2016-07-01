'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var contentSchema = new Schema( {
    "legacy_id" : Number,
    "name" : String,
    "make" : {
        type: mongoose.Schema.ObjectId,
        ref: 'make',
    },
    "make_id" : Number,
    "url_alias" : String,
    "market_segment" : Number,
    "state" : String,
    "primary_submodel" : String
});

module.exports = mongoose.model( 'model', contentSchema );
