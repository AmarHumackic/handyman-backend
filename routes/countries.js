const express = require('express');
const router = express.Router();
const Country = require('../models/country');


// get all countries
router.get('/', async (req, res) => {
    console.log('object')
    try{
        const country = await Country.find();
        res.json(country);
    }catch(err){
        res.json({ message: err });
    }
});

// get country by id
router.get('/:countryId', async (req, res) => {
    try{
        const country = await countryId.findById(req.params.countryId);
        res.json(country);
    }catch(err){
        res.json({ message: err });
    }
});

// add country
router.post('/', async (req, res) => {
    const country = new Country({
        name: req.body.name,
        code: req.body.code
    });
    try{
        const savedCountry = await country.save();
        res.json(savedCountry);
    }catch(err){
        res.json({ message: err });
    }

});

// uredi grad
router.patch('/:countryId', async (req, res) => {
    try{
        const updatedCountry = await Country.updateOne(
            { _id: req.params.countryId },
            { $set: { name: req.body.name, code: req.body.code }}
        );
        res.json(updatedCountry);
    }catch(err){
        res.json({ message: err });
    }
});

// pobriši grad
router.delete('/:countryId', async (req, res) => {
    try{
        const removedCountry = await Country.remove({ _id: req.params.countryId});
        res.json(removedCountry);
    }catch(err){
        res.json({ message: err });
    }
});

module.exports = router;