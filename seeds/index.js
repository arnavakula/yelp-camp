const mongoose = require('mongoose');
const Campground = require('../models/campground')
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');

mongoose.connect('mongodb://localhost:27017/yelp-camp');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('database connected');
})

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async (seed) => {
    await Campground.deleteMany({});

    for(let i = 0; i < seed; i++){
        const randLoc = sample(cities);

        const campground = new Campground({
            location: `${randLoc.city}, ${randLoc.state}`,
            title: `${sample(descriptors)} ${sample(places)}`
        })

        await campground.save();
    }
} 

seedDB(50).then(() => mongoose.connection.close());