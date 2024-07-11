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
        const price = Math.floor(Math.random() * 20) + 10

        const campground = new Campground({
            location: `${randLoc.city}, ${randLoc.state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: `https://picsum.photos/400?random=${Math.random()}`,
            description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Molestiae impedit cumque saepe ea, dignissimos ratione dolore ullam quibusdam adipisci? Qui animi, quia maxime minus quis natus suscipit fuga fugit facere.',
            price,
            author: '669031965a30ccb852e776f9'
        })

        await campground.save();
    }
} 

seedDB(50).then(() => mongoose.connection.close());

