const Campground = require('../models/campground');
const { cloudinary } = require('../cloudinary');

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new');
}

module.exports.showCampground = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate({
        path:'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');

    if(!campground){
        req.flash('error', 'Cannot find that campground :(')
        return res.redirect('/campgrounds');
    }

    res.render('campgrounds/show', { campground });
}

module.exports.createCampground = async (req, res, next) => { 
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    campground.images = req.files.map(f => ({
        url: f.path,
        filename: f.filename
    }));

    await campground.save();

    console.log(campground);

    req.flash('success', 'Succesfully added new campground!');
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);

    if(!campground){
        req.flash('error', 'Cannot find that campground :(')
        return res.redirect('/campgrounds');
    }
    
    res.render('campgrounds/edit', { campground });
}

module.exports.updateCampground = async (req, res) => {
    const { id } = req.params;

    console.log(req.body);
    
    const campground = await Campground.findByIdAndUpdate(id, req.body.campground);
    const imgs = req.files.map(f => ({
        url: f.path,
        filename: f.filename
    }));
    campground.images.push(...imgs);

    await campground.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}}});

    await campground.save();

    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
        }
    }
    req.flash('success', 'Succesfully updated campground!')
    res.redirect(`/campgrounds/${id}`);
}

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);

    if(!campground){
        req.flash('error', 'Cannot find that campground :(')
        return res.redirect('/campgrounds');
    }

    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Succesfully deleted campground!')
    res.redirect(`/campgrounds`);
}