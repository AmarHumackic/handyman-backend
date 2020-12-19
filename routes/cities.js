const express = require('express');
const router = express.Router();
const City = require('../models/city');


// svi gradovi
router.get('/', async (req, res) => {
    try{
        const city = await City.find();
        res.json(city);
    }catch(err){
        res.json({ message: err });
    }
});

// određeni grad
router.get('/:cityId', async (req, res) => {
    try{
        const city = await City.findById(req.params.cityId);
    }catch(err){
        res.json({ message: err });
    }
});

// dodaj grad
router.post('/', async (req, res) => {
    console.log('req', req)
    const city = new City({
        name: req.body.name,
        region: req.body.region
    });
    try{
        const savedCity = await city.save();
        res.json(savedCity);
    }catch(err){
        res.json({ message: err });
    }

});

// uredi grad
router.patch('/:cityId', async (req, res) => {
    try{
        const updatedCity = await City.updateOne(
            { _id: req.params.cityId },
            { $set: { name: req.body.name }}
        );
        res.json(updatedCity);
    }catch(err){
        res.json({ message: err });
    }
});

// pobriši grad
router.delete('/:cityId', async (req, res) => {
    try{
        const removedCity = await City.remove({ _id: req.params.cityId});
    }catch(err){
        res.json({ message: err });
    }
});

module.exports = router;