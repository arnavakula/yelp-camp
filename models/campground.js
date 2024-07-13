const mongoose = require('mongoose');
const Review = require('./review')
const Schema = mongoose.Schema;

const opts = { toJSON: { virtuals: true } };

const ImageSchema = new Schema({
    url: String,
    filename: String
})

ImageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload', '/upload/w_150');
})

const CampgroundSchema = new Schema({
    title: String,
    images: [ImageSchema], 
    price: Number,
    description: String,
    location: String,
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ],
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, opts);

//middleware for deleting reviews after deleting a campground
CampgroundSchema.post('findOneAndDelete', async function(doc){
    if(doc){
        await Review.deleteMany({_id: {$in: doc.reviews}});
    }
})

CampgroundSchema.virtual('properties.popupText').get(function(){
    return `<a href=/campgrounds/${this._id}><strong>${this.title}</strong></a><p>${this.location}<br>${this.description.substring(0,30)}...</p>`;

})

module.exports = mongoose.model('Campground', CampgroundSchema);