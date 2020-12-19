const mongoose = require('mongoose');

const CitySchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    }, 
    region_id: {   
        _id: String,
        name: String
    }
    
});

module.exports = mongoose.model('Cities', CitySchema);